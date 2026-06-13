import { Project, SourceFile, Node, SyntaxKind } from "ts-morph"
import { prisma } from "@/lib/prisma"

type AstKind = "component" | "function" | "hook" | "style" | "example"

interface CodeSnippet {
  fileId: string
  startLine: number
  endLine: number
  astKind: AstKind
  componentName?: string
  exportName?: string
  text: string
  tokenCount: number
  meta: {
    imports: string[]
    propsInterface?: string
    usesHooks: string[]
    containsJSX: boolean
    symbols: string[]
    containsApi: string[]
  }
}

export class ASTChunkingService {
  private static project: Project | null = null

  private static getProject(): Project {
    if (!this.project) {
      this.project = new Project({
        compilerOptions: {
          target: 99, // Latest
          module: 99, // ESNext
          jsx: 4, // React JSX
          allowJs: true,
          esModuleInterop: true,
          skipLibCheck: true,
        },
      })
    }
    return this.project
  }

  /**
   * Main entry point: chunk code using AST analysis
   */
  static async chunkCodeWithAST(
    code: string,
    filePath: string,
    componentId: number,
    demoId: number | null,
    componentName: string,
  ): Promise<CodeSnippet[]> {
    const project = this.getProject()

    try {
      // Create temporary source file for AST analysis
      const sourceFile = project.createSourceFile(
        `temp-${Date.now()}.tsx`,
        code,
        { overwrite: true },
      )

      const snippets = this.chunkFile(sourceFile, {
        fileId: filePath,
        componentId,
        demoId,
        componentName,
        isExample: filePath.includes("/demo-") || demoId !== null,
      })

      // Clean up
      sourceFile.delete()

      return snippets
    } catch (error) {
      console.error(
        "AST chunking failed, falling back to simple approach:",
        error,
      )

      // Fallback: treat entire file as one chunk
      return [
        {
          fileId: filePath,
          startLine: 1,
          endLine: code.split("\n").filter((line) => line.trim()).length,
          astKind: demoId ? "example" : "component",
          componentName,
          text: code,
          tokenCount: this.estimateTokenCount(code),
          meta: {
            imports: this.extractImports(code),
            usesHooks: this.detectHooks(code),
            containsJSX: code.includes("<") && code.includes(">"),
            symbols: this.extractSymbols(code),
            containsApi: this.extractApiUsage(code),
          },
        },
      ]
    }
  }

  /**
   * Chunk a single file following best practices
   */
  private static chunkFile(
    sourceFile: SourceFile,
    context: {
      fileId: string
      componentId: number
      demoId: number | null
      componentName: string
      isExample: boolean
    },
  ): CodeSnippet[] {
    const snippets: CodeSnippet[] = []
    const imports = this.getImportModules(sourceFile)
    const totalTokens = this.estimateTokenCount(sourceFile.getFullText())

    // Rule 1: Demo/example files - keep as complete examples
    if (context.isExample && totalTokens <= 1000) {
      return [
        {
          fileId: context.fileId,
          startLine: 1,
          endLine: sourceFile
            .getFullText()
            .split("\n")
            .filter((line) => line.trim()).length,
          astKind: "example",
          componentName: context.componentName,
          text: sourceFile.getFullText(),
          tokenCount: totalTokens,
          meta: {
            imports,
            usesHooks: this.detectHooksInFile(sourceFile),
            containsJSX: this.hasJSXInFile(sourceFile),
            symbols: this.extractSymbolsFromFile(sourceFile),
            containsApi: this.extractApiUsageFromFile(sourceFile),
          },
        },
      ]
    }

    // Rule 2: Small component files - keep as complete units
    if (!context.isExample && totalTokens <= 600) {
      // Reduced limit
      return [
        {
          fileId: context.fileId,
          startLine: 1,
          endLine: sourceFile
            .getFullText()
            .split("\n")
            .filter((line) => line.trim()).length,
          astKind: "component",
          componentName: context.componentName,
          exportName: this.findMainExportName(sourceFile),
          text: sourceFile.getFullText(),
          tokenCount: totalTokens,
          meta: {
            imports,
            propsInterface: this.findPropsInterface(sourceFile),
            usesHooks: this.detectHooksInFile(sourceFile),
            containsJSX: this.hasJSXInFile(sourceFile),
            symbols: this.extractSymbolsFromFile(sourceFile),
            containsApi: this.extractApiUsageFromFile(sourceFile),
          },
        },
      ]
    }

    // Rule 3: Large files - split by major exported components/functions
    const exportedNodes = this.findExportedNodes(sourceFile)

    for (let i = 0; i < exportedNodes.length; i++) {
      const node = exportedNodes[i]
      const isFirstNode = i === 0 // First node gets imports included
      const nodeSnippet = this.buildNodeSnippet(
        node,
        context,
        imports,
        isFirstNode,
      )
      if (nodeSnippet) {
        snippets.push(nodeSnippet)
      }

      // Extract related styled components near this node (only if nodeSnippet exists)
      if (nodeSnippet) {
        const styledBlocks = this.extractStyledBlocksNear(node)
        for (const styledBlock of styledBlocks) {
          const styledSnippet = this.buildStyleSnippet(
            styledBlock,
            nodeSnippet.componentName || context.componentName,
          )
          if (styledSnippet) {
            snippets.push(styledSnippet)
          }
        }
      }
    }

    // If no exported nodes found, fallback to entire file
    if (snippets.length === 0) {
      snippets.push({
        fileId: context.fileId,
        startLine: 1,
        endLine: sourceFile
          .getFullText()
          .split("\n")
          .filter((line) => line.trim()).length,
        astKind: context.isExample ? "example" : "component",
        componentName: context.componentName,
        text: sourceFile.getFullText(),
        tokenCount: totalTokens,
        meta: {
          imports,
          usesHooks: this.detectHooksInFile(sourceFile),
          containsJSX: this.hasJSXInFile(sourceFile),
          symbols: this.extractSymbolsFromFile(sourceFile),
          containsApi: this.extractApiUsageFromFile(sourceFile),
        },
      })
    }

    return snippets
  }

  /**
   * Build snippet for a major AST node (component/function)
   */
  private static buildNodeSnippet(
    node: Node,
    context: any,
    imports: string[],
    isFirstNode = false,
  ): CodeSnippet | null {
    const text = node.getFullText()
    const tokenCount = this.estimateTokenCount(text)

    // Include related interface if it's small and nearby
    const relatedInterface = this.findRelatedInterface(node)
    let fullText = text
    let startLine = node.getStartLineNumber()
    let endLine = node.getEndLineNumber()

    // For first node in file, include imports at the beginning
    if (isFirstNode && imports.length > 0) {
      const importText = imports
        .map((imp) => `import ... from "${imp}"`)
        .join("\n")
      fullText = `// Imports: ${imports.join(", ")}\n\n` + text
      startLine = 1 // Start from beginning of file
    }

    if (
      relatedInterface &&
      this.estimateTokenCount(relatedInterface.getFullText()) < 100
    ) {
      const interfaceText = relatedInterface.getFullText()
      if (isFirstNode) {
        // Interface goes after imports but before component
        fullText = fullText.replace(text, interfaceText + "\n\n" + text)
      } else {
        fullText = interfaceText + "\n\n" + text
      }
      startLine = Math.min(startLine, relatedInterface.getStartLineNumber())
      endLine = Math.max(endLine, relatedInterface.getEndLineNumber())
    }

    // If still too large, split safely
    if (this.estimateTokenCount(fullText) > 600) {
      return this.splitLargeNodeSafely(node, context, imports)
    }

    const isReactComponent = this.isReactComponent(node)
    const isHook = this.isCustomHook(node)

    // Recalculate line numbers based on final text
    const finalLines = fullText.trim().split("\n")
    const actualStartLine = startLine
    const actualEndLine = actualStartLine + finalLines.length - 1

    return {
      fileId: context.fileId,
      startLine: actualStartLine,
      endLine: actualEndLine,
      astKind: context.isExample
        ? "example"
        : isHook
          ? "hook"
          : isReactComponent
            ? "component"
            : "function",
      componentName: context.componentName,
      exportName: this.getNodeName(node),
      text: fullText.trim(),
      tokenCount: this.estimateTokenCount(fullText),
      meta: {
        imports,
        propsInterface: relatedInterface?.getText(),
        usesHooks: this.detectHooksInText(fullText),
        containsJSX: fullText.includes("<") && fullText.includes(">"),
        symbols: this.extractSymbolsFromText(fullText),
        containsApi: this.extractApiUsageFromText(fullText),
      },
    }
  }

  /**
   * Split large nodes safely with overlap
   */
  private static splitLargeNodeSafely(
    node: Node,
    context: any,
    imports: string[],
  ): CodeSnippet {
    const text = node.getFullText()
    const lines = text.split("\n")
    const targetTokens = 500
    const overlapLines = Math.ceil(lines.length * 0.15) // 15% overlap

    // For now, return the full node - splitting will be added if needed
    // In practice, most React components fit in 500-800 tokens
    // Calculate actual line count for display
    const actualLines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim()).length

    return {
      fileId: context.fileId,
      startLine: node.getStartLineNumber(),
      endLine: node.getStartLineNumber() + actualLines - 1,
      astKind: context.isExample ? "example" : "component",
      componentName: context.componentName,
      exportName: this.getNodeName(node),
      text: text.trim(),
      tokenCount: this.estimateTokenCount(text),
      meta: {
        imports,
        usesHooks: this.detectHooksInText(text),
        containsJSX: text.includes("<") && text.includes(">"),
        symbols: this.extractSymbolsFromText(text),
        containsApi: this.extractApiUsageFromText(text),
      },
    }
  }

  /**
   * Build styled component snippet
   */
  private static buildStyleSnippet(
    styledNode: Node,
    componentName: string,
  ): CodeSnippet | null {
    const text = styledNode.getFullText()
    const tokenCount = this.estimateTokenCount(text)

    if (tokenCount < 50) return null // Skip tiny styled snippets

    const actualLines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim()).length

    return {
      fileId: "styled",
      startLine: styledNode.getStartLineNumber(),
      endLine: styledNode.getStartLineNumber() + actualLines - 1,
      astKind: "style",
      componentName,
      exportName: this.getNodeName(styledNode),
      text: text.trim(),
      tokenCount,
      meta: {
        imports: [],
        usesHooks: [],
        containsJSX: false,
        symbols: [this.getNodeName(styledNode)].filter(Boolean),
        containsApi: [],
      },
    }
  }

  // Helper methods for AST analysis
  private static getImportModules(sourceFile: SourceFile): string[] {
    return sourceFile
      .getImportDeclarations()
      .map((imp) => imp.getModuleSpecifierValue())
  }

  private static findExportedNodes(sourceFile: SourceFile): Node[] {
    const nodes: Node[] = []

    // Find ALL major code blocks, not just exported ones
    // (For large files, we want to split by logical units)

    // All classes (exported or not, if they're substantial)
    sourceFile.getClasses().forEach((cls) => {
      if (cls.getFullText().length > 200) {
        // Substantial classes
        nodes.push(cls)
      }
    })

    // All functions (exported or not, if they're substantial)
    sourceFile.getFunctions().forEach((func) => {
      if (func.getFullText().length > 100) {
        // Substantial functions
        nodes.push(func)
      }
    })

    // Exported variable statements (React components, etc.)
    sourceFile.getVariableStatements().forEach((varStmt) => {
      const text = varStmt.getFullText()
      if (
        text.length > 100 &&
        (varStmt.isExported() || this.looksLikeComponent(text))
      ) {
        nodes.push(varStmt)
      }
    })

    // If no substantial nodes found, split by all top-level statements
    if (nodes.length === 0) {
      sourceFile.getStatements().forEach((stmt) => {
        if (
          stmt.getKind() !== SyntaxKind.ImportDeclaration &&
          stmt.getFullText().trim().length > 50
        ) {
          nodes.push(stmt)
        }
      })
    }

    return nodes
  }

  private static looksLikeComponent(text: string): boolean {
    return (
      /const\s+[A-Z]\w*\s*=/.test(text) &&
      (text.includes("<") || text.includes("React."))
    )
  }

  private static isReactComponent(node: Node): boolean {
    const text = node.getFullText()
    return (
      (text.includes("function") || text.includes("=>")) &&
      text.includes("<") &&
      text.includes(">") &&
      /^[A-Z]/.test(this.getNodeName(node) || "")
    )
  }

  private static isCustomHook(node: Node): boolean {
    const name = this.getNodeName(node)
    return name ? name.startsWith("use") && name.length > 3 : false
  }

  private static getNodeName(node: Node): string {
    if (Node.isFunctionDeclaration(node)) {
      return node.getName() || ""
    }
    if (Node.isVariableStatement(node)) {
      const declaration = node.getDeclarations()[0]
      return declaration?.getName() || ""
    }
    if (Node.isClassDeclaration(node)) {
      return node.getName() || ""
    }
    return ""
  }

  private static findMainExportName(sourceFile: SourceFile): string {
    // Look for default export
    const defaultExport = sourceFile
      .getExportAssignments()
      .find((exp) => exp.isExportEquals() === false)
    if (defaultExport) {
      return "default"
    }

    // Look for named exports
    const namedExports = sourceFile.getExportDeclarations()
    if (namedExports.length > 0) {
      const firstExport = namedExports[0].getNamedExports()[0]
      return firstExport?.getName() || ""
    }

    return ""
  }

  private static findPropsInterface(
    sourceFile: SourceFile,
  ): string | undefined {
    const interfaces = sourceFile.getInterfaces()
    const propsInterface = interfaces.find(
      (iface) =>
        iface.getName().includes("Props") ||
        iface.getName().includes("Properties"),
    )
    return propsInterface?.getText()
  }

  private static findRelatedInterface(node: Node): Node | null {
    const sourceFile = node.getSourceFile()
    const nodeName = this.getNodeName(node)

    if (!nodeName) return null

    // Look for interface with matching name pattern
    const interfaces = sourceFile.getInterfaces()
    return (
      interfaces.find((iface) => {
        const ifaceName = iface.getName()
        return ifaceName.includes(nodeName) || ifaceName.includes("Props")
      }) || null
    )
  }

  private static extractStyledBlocksNear(node: Node): Node[] {
    const sourceFile = node.getSourceFile()
    const styledBlocks: Node[] = []

    // Find styled components (const StyledX = styled.*)
    sourceFile.getVariableStatements().forEach((varStmt) => {
      const declaration = varStmt.getDeclarations()[0]
      const initializer = declaration?.getInitializer()

      if (initializer && initializer.getText().includes("styled.")) {
        styledBlocks.push(varStmt)
      }
    })

    return styledBlocks
  }

  private static detectHooksInFile(sourceFile: SourceFile): string[] {
    const hooks: string[] = []
    const text = sourceFile.getFullText()

    const hookPatterns = [
      /\buseState\b/g,
      /\buseEffect\b/g,
      /\buseCallback\b/g,
      /\buseMemo\b/g,
      /\buseRef\b/g,
      /\buseContext\b/g,
      /\buseReducer\b/g,
      /\buse[A-Z]\w*/g, // Custom hooks
    ]

    hookPatterns.forEach((pattern) => {
      const matches = text.match(pattern)
      if (matches) {
        hooks.push(...matches)
      }
    })

    return [...new Set(hooks)]
  }

  private static detectHooksInText(text: string): string[] {
    return this.detectHooksInFile({ getFullText: () => text } as any)
  }

  private static hasJSXInFile(sourceFile: SourceFile): boolean {
    return (
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length >
        0
    )
  }

  private static extractSymbolsFromFile(sourceFile: SourceFile): string[] {
    const symbols: string[] = []

    // Function names
    sourceFile.getFunctions().forEach((func) => {
      const name = func.getName()
      if (name) symbols.push(name)
    })

    // Class names
    sourceFile.getClasses().forEach((cls) => {
      const name = cls.getName()
      if (name) symbols.push(name)
    })

    // Variable declarations (components, etc.)
    sourceFile.getVariableDeclarations().forEach((varDecl) => {
      const name = varDecl.getName()
      if (name && /^[A-Z]/.test(name)) {
        // Likely component
        symbols.push(name)
      }
    })

    // Interface names
    sourceFile.getInterfaces().forEach((iface) => {
      symbols.push(iface.getName())
    })

    return [...new Set(symbols)]
  }

  private static extractSymbolsFromText(text: string): string[] {
    const symbols: string[] = []

    // Function declarations
    const functionRegex =
      /(?:function|const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
    let match
    while ((match = functionRegex.exec(text)) !== null) {
      symbols.push(match[1])
    }

    // JSX component usage
    const jsxRegex = /<([A-Z][a-zA-Z0-9]*)/g
    while ((match = jsxRegex.exec(text)) !== null) {
      symbols.push(match[1])
    }

    return [...new Set(symbols)]
  }

  private static extractApiUsageFromFile(sourceFile: SourceFile): string[] {
    return this.extractApiUsageFromText(sourceFile.getFullText())
  }

  private static extractApiUsageFromText(text: string): string[] {
    const apis: string[] = []

    // Event handlers
    if (text.includes("onClick")) apis.push("onClick")
    if (text.includes("onChange")) apis.push("onChange")
    if (text.includes("onSubmit")) apis.push("onSubmit")

    // Hooks
    if (text.includes("useState")) apis.push("useState")
    if (text.includes("useEffect")) apis.push("useEffect")
    if (text.includes("useCallback")) apis.push("useCallback")

    // Network calls
    if (text.includes("fetch(")) apis.push("fetch")
    if (text.includes("axios")) apis.push("axios")

    return apis
  }

  private static extractImports(code: string): string[] {
    const imports: string[] = []
    const importRegex =
      /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)?\s*(?:,\s*{[^}]+})?\s*from\s+['"](.*?)['"]/g

    let match
    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1])
    }

    return imports
  }

  private static detectHooks(code: string): string[] {
    const hooks: string[] = []
    const hookPatterns = [
      /\buseState\b/g,
      /\buseEffect\b/g,
      /\buseCallback\b/g,
      /\buseMemo\b/g,
      /\buse[A-Z]\w*/g,
    ]

    hookPatterns.forEach((pattern) => {
      const matches = code.match(pattern)
      if (matches) {
        hooks.push(...matches)
      }
    })

    return [...new Set(hooks)]
  }

  private static extractSymbols(code: string): string[] {
    return this.extractSymbolsFromText(code)
  }

  private static extractApiUsage(code: string): string[] {
    return this.extractApiUsageFromText(code)
  }

  private static estimateTokenCount(text: string): number {
    // More accurate token estimation for code
    const words = text.split(/\s+/).length
    const symbols = (text.match(/[{}()[\];,<>]/g) || []).length
    const strings = (text.match(/["'`][^"'`]*["'`]/g) || []).length
    return Math.ceil(words * 0.75 + symbols * 0.3 + strings * 0.5)
  }

  /**
   * Generate correct file path based on component registry
   */
  private static getComponentFilePath(component: any): string {
    const { component_slug, registry } = component

    if (registry === "lib") {
      return `lib/${component_slug}.tsx`
    } else if (registry === "hooks") {
      return `hooks/${component_slug}.tsx`
    } else {
      // For ui, blocks, icons, etc.
      return `components/${registry}/${component_slug}.tsx`
    }
  }

  /**
   * Generate correct demo file path
   */
  private static getDemoFilePath(component: any, demoSlug: string): string {
    const { component_slug, registry } = component
    const basePath = this.getComponentFilePath(component).replace(".tsx", "")
    return `${basePath}/demo-${demoSlug}.tsx`
  }

  /**
   * Main API method for generating chunks for components
   */
  static async generateChunksForComponents(
    componentIds: number[],
    forceRegenerate = false,
  ) {
    const results = []

    for (const componentId of componentIds) {
      try {
        const result = await this.processComponentWithAST(
          componentId,
          forceRegenerate,
        )
        results.push(result)
      } catch (error) {
        console.error(`Failed to process component ${componentId}:`, error)
        results.push({
          componentId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return results
  }

  /**
   * Process a single component with AST chunking
   */
  private static async processComponentWithAST(
    componentId: number,
    forceRegenerate = false,
  ) {
    // Check if chunks already exist
    if (!forceRegenerate) {
      const existingChunksCount = await prisma.codeChunk.count({
        where: { component_id: componentId },
      })

      if (existingChunksCount > 0) {
        return {
          componentId,
          success: true,
          message: "Chunks already exist, skipping",
          chunksCreated: 0,
        }
      }
    }

    // Get component with demos and registry info
    const component = await prisma.component.findUnique({
      where: { id: componentId },
      include: {
        demos: {
          select: {
            id: true,
            demo_code: true,
            demo_slug: true,
            name: true,
            demoTags: {
              select: {
                tag: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
      // Add registry field to the component data
    })

    if (!component) {
      throw new Error(`Component ${componentId} not found`)
    }

    // Get registry info (since it's not included in the include above)
    const componentWithRegistry = await prisma.component.findUnique({
      where: { id: componentId },
      select: {
        component_slug: true,
        registry: true,
      },
    })

    const fullComponent = {
      ...component,
      component_slug: componentWithRegistry?.component_slug,
      registry: componentWithRegistry?.registry || "ui", // Default to ui
    }

    const allSnippets: any[] = []

    // Filter generic tags (same logic as in embedding service)
    const GENERIC_TAGS = new Set([
      "accordions",
      "accordion",
      "alerts",
      "alert",
      "alert dialog",
      "avatars",
      "avatar",
      "badges",
      "badge",
      "buttons",
      "button",
      "calendars",
      "calendar",
      "carousels",
      "carousel",
      "checkboxes",
      "checkbox",
      "dialogs",
      "dialog",
      "modals",
      "modal",
      "dropdowns",
      "dropdown",
      "forms",
      "form",
      "icons",
      "icon",
      "inputs",
      "input",
      "links",
      "link",
      "menus",
      "menu",
      "notifications",
      "notification",
      "numbers",
      "number",
      "tables",
      "table",
      "tabs",
      "tab",
      "toasts",
      "toast",
      "toggles",
      "toggle",
      "tooltips",
      "tooltip",
      "analytics",
      "admin panel",
      "404",
      "accessibility",
      "agency",
      "about us",
      "add new",
      "ai",
      "android",
      "angular",
    ])

    const filterTags = (tags: string[]): string[] => {
      if (!Array.isArray(tags)) return []

      // First filter out generic tags, THEN take top 3
      const filtered = tags.filter(
        (tag) => !GENERIC_TAGS.has(tag.toLowerCase()),
      )

      // Prioritize specific functional tags
      const priorityTags = filtered.filter((tag) => {
        const lower = tag.toLowerCase()
        return (
          lower.includes("noise") ||
          lower.includes("grainy") ||
          lower.includes("pixel") ||
          lower.includes("animation") ||
          lower.includes("gradient") ||
          lower.includes("canvas") ||
          lower.includes("pattern") ||
          lower.includes("hero")
        )
      })

      const otherTags = filtered.filter((tag) => {
        const lower = tag.toLowerCase()
        return !(
          lower.includes("noise") ||
          lower.includes("grainy") ||
          lower.includes("pixel") ||
          lower.includes("animation") ||
          lower.includes("gradient") ||
          lower.includes("canvas") ||
          lower.includes("pattern") ||
          lower.includes("hero")
        )
      })

      // Combine priority tags first, then others, max 3 total
      return [...priorityTags, ...otherTags].slice(0, 3)
    }

    // Get default demo tags for component chunks (filtered)
    const defaultDemo =
      fullComponent.demos.find((d) => d.demo_slug === "default") ||
      fullComponent.demos[0]
    const defaultDemoTags =
      defaultDemo?.demoTags?.length > 0
        ? filterTags(defaultDemo.demoTags.map((dt) => dt.tag.name))
        : []

    // Process main component code
    if (fullComponent.code && fullComponent.code !== "N/A") {
      let componentCodeContent = fullComponent.code

      // Fetch from CDN if needed
      if (fullComponent.code.startsWith("http")) {
        try {
          const response = await fetch(fullComponent.code)
          if (response.ok) {
            componentCodeContent = await response.text()
          }
        } catch (error) {
          console.error(`❌ Failed to fetch component code:`, error)
          return {
            componentId,
            success: false,
            error: `Failed to fetch component code`,
          }
        }
      }

      // AST chunk component
      if (
        componentCodeContent.trim() &&
        !componentCodeContent.startsWith("http")
      ) {
        const componentSnippets = await this.chunkCodeWithAST(
          componentCodeContent,
          this.getComponentFilePath(fullComponent),
          componentId,
          null,
          fullComponent.name,
        )
        allSnippets.push(...componentSnippets)
      }
    }

    // Process demo code
    for (const demo of fullComponent.demos) {
      if (demo.demo_code) {
        try {
          let demoCodeContent = demo.demo_code

          // Fetch demo code if URL
          if (demo.demo_code.startsWith("http")) {
            const response = await fetch(demo.demo_code)
            if (response.ok) {
              demoCodeContent = await response.text()
            }
          }

          // AST chunk demo
          const demoSnippets = await this.chunkCodeWithAST(
            demoCodeContent,
            this.getDemoFilePath(fullComponent, demo.demo_slug),
            componentId,
            demo.id,
            fullComponent.name,
          )
          allSnippets.push(...demoSnippets)
        } catch (error) {
          console.error(`Failed to process demo ${demo.id}:`, error)
        }
      }
    }

    // Save snippets to database
    let chunksCreated = 0
    for (const snippet of allSnippets) {
      try {
        // Determine demo_id and tags for chunks
        let demoId = null
        let chunkTags = defaultDemoTags // Default to component's demo tags

        if (snippet.astKind === "example") {
          // Find the specific demo that matches this file path
          const demo = fullComponent.demos.find((d) =>
            snippet.fileId.includes(`demo-${d.demo_slug}`),
          )
          demoId = demo?.id || null

          // Use specific demo tags for example chunks (filtered)
          if (demo?.demoTags && demo.demoTags.length > 0) {
            chunkTags = filterTags(demo.demoTags.map((dt) => dt.tag.name))
          }
        }

        await prisma.codeChunk.create({
          data: {
            component_id: componentId,
            demo_id: demoId,
            chunk_text: snippet.text,
            code_type: snippet.astKind,
            start_line: snippet.startLine,
            end_line: snippet.endLine,
            file_path: snippet.fileId,
            component_name: fullComponent.name,
            symbols: snippet.meta.symbols,
            imports: snippet.meta.imports,
            language: "typescript",
            uses_hooks: snippet.meta.usesHooks.length > 0,
            has_jsx: snippet.meta.containsJSX,
            contains_api: snippet.meta.containsApi,
            complexity_score: snippet.text
              .split("\n")
              .filter((line: string) => line.trim()).length, // Real line count
            tags: chunkTags,
          },
        })
        chunksCreated++
      } catch (error) {
        console.error("Failed to save snippet:", error)
      }
    }

    return {
      componentId,
      success: true,
      message: `AST processed ${fullComponent.name}`,
      chunksCreated,
      totalSnippets: allSnippets.length,
    }
  }
}
