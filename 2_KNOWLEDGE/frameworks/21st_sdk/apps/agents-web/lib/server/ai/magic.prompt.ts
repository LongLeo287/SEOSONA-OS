export const getSearchQueriesPrompt = (message: string) => {
  return `Generate precise UI component search queries for 21st.dev to enhance existing interface design. Analyze the user request to identify components that need visual refinement.

Message:
----
${message}
----

ANALYSIS INSTRUCTIONS:
1. Identify UI elements needing improvement by examining:
 • Components mentioned in the message
 • UI patterns that could be enhanced
 • Areas where modern design patterns could improve UX
2. Categorize improvement opportunities:
 • Input & Form Elements → fields, selects, checkboxes, radios
 • Action Components → buttons, links, toggles, dropdowns
 • Layout Structures → cards, containers, grids, sidebars
 • Feedback Elements → alerts, toasts, modals, loaders
 • Navigation → menus, tabs, breadcrumbs, pagination
3. For each improvement opportunity:
 • Create a specific 2-4 word search query
 • Include both component type AND desired style/quality
 • Focus on visual enhancement, not functionality changes

EXAMPLE TRANSFORMATIONS:
- "need a submit button" → "gradient button design"
- "add input fields" → "floating label input"
- "create a modal" → "animated modal dialog"
- "the sidebar is confusing" → "intuitive sidebar navigation"

OUTPUT FORMAT:
Return an array of strings with 1-5 unique search queries for 21st.dev, prioritizing the most impactful UI components.
Example: ["interactive table component", "form validation visual", "dark theme toggle", "card hover effect"]

Focus exclusively on UI refinement with modern components rather than changing functionality.
You must ONLY RETURN A VALID ARRAY OF STRINGS. Array length may vary depending on the complexity of a request. NO PREAMBULE OR ANY OTHER TEXT IN RESPONSE, ONLY ARRAY.
`
}

export const generateComponentSystemPrompt = (
  message: string,
  components: string,
) => {
  return `
Goal:

Generate a UI component that satisfies the user's request with a refined design, heavily inspired by the reference components provided.

Component Requirements:
- Use Tailwind CSS for styling
- Use shadcn theming variables like \`bg-background\`, \`text-foreground\`, \`border-border\`, primary colors, etc.
- Use icons only from 'lucide-react' or '@remixicon/react' libraries

CRITICAL - Component Inclusion Rules:
1. ONLY use components from this default list without including their code:
'accordion', 'alert-dialog', 'alert', 'aspect-ratio', 'avatar', 'badge', 'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'collapsible', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input-otp', 'input', 'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster', 'toggle-group', 'toggle', 'tooltip', 'use-mobile'

2. If you use ANY component from the reference examples that is NOT in the default list above (like Spotlight, SplineScene, etc.), you MUST include its FULL implementation code in the output file - do not just import it.

3. Every component that is used in your code MUST either:
   - Be a standard React/HTML element (div, span, etc.)
   - Be importable from an external library (framer-motion, lucide-react, etc.)
   - Be on the default component list above
   - OR have its FULL implementation included in the output

TypeScript/React Code Quality Requirements:
1. DO NOT both import AND implement the same functionality - choose one approach; We should not have Duplicate names in the output file. IT'S A MUST
2. When adapting code from references, merge duplicate functionality instead of copying it
3. PROPERLY define and use TypeScript interfaces and types for all props and data
4. CHECK all imports are present and correctly referenced
5. ENSURE only ONE default export in the entire file
6. FOLLOW React Hooks rules (don't use hooks conditionally, etc.)
7. VERIFY no naming collisions between different components or variables

Component Guidelines:
- All props must contain default values for preview purpose of this component.
- Generated component must be fully working and ready to use, it will be inserted without props, just as like "<Component />"
- For application UI components, prioritize using shadcn components as a foundation
- For marketing components, you have more creative freedom
- IMPORTANT: Carefully analyze the structure, styling patterns, and component composition from the reference examples

Return Format:
Return ONE complete TypeScript/TSX file that includes:
1. ALL necessary imports (from external libraries like framer-motion, etc.)
2. The FULL implementation of ANY custom components used (including those found in reference examples)
3. The main component implementation
4. A usage example with \`export default\`

Instructions:
1. Thoroughly analyze the reference components provided - these are your primary inspiration
2. Identify patterns, styling approaches, and component structures from these examples
3. If using components from references that aren't in the default list, include their COMPLETE implementation code
4. NEVER import a component from "@/components/ui/" unless it's in the default list provided above
5. SCAN the entire file for duplicate declarations before finalizing
6. REVIEW the final code to ensure it's TypeScript-valid with no duplications or runtime issues

Generate a single valid, complete TypeScript/TSX file that includes ALL necessary code to make the component work. The file must include both the component implementation and a usage example with \`export default\`. Answer should contain only the code with no additional text or comments.
`
}

export const generateComponentPrompt = (
  message: string,
  components: string,
) => {
  return `
Goal:

Generate a UI component that satisfies the user's request with a refined design, heavily inspired by the reference components provided.

Component Requirements:
- Use Tailwind CSS for styling
- Use shadcn theming variables like \`bg-background\`, \`text-foreground\`, \`border-border\`, primary colors, etc.
- Use icons only from 'lucide-react' or '@remixicon/react' libraries

CRITICAL - Component Inclusion Rules:
1. ONLY use components from this default list without including their code:
'accordion', 'alert-dialog', 'alert', 'aspect-ratio', 'avatar', 'badge', 'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'collapsible', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input-otp', 'input', 'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster', 'toggle-group', 'toggle', 'tooltip', 'use-mobile'

2. If you use ANY component from the reference examples that is NOT in the default list above (like Spotlight, SplineScene, etc.), you MUST include its FULL implementation code in the output file - do not just import it.

3. Every component that is used in your code MUST either:
   - Be a standard React/HTML element (div, span, etc.)
   - Be importable from an external library (framer-motion, lucide-react, etc.)
   - Be on the default component list above
   - OR have its FULL implementation included in the output

TypeScript/React Code Quality Requirements:
1. DO NOT both import AND implement the same functionality - choose one approach; We should not have Duplicate names in the output file. IT'S A MUST
2. When adapting code from references, merge duplicate functionality instead of copying it
3. PROPERLY define and use TypeScript interfaces and types for all props and data
4. CHECK all imports are present and correctly referenced
5. ENSURE only ONE default export in the entire file
6. FOLLOW React Hooks rules (don't use hooks conditionally, etc.)
7. VERIFY no naming collisions between different components or variables

Component Guidelines:
- All props must contain default values for preview purpose of this component.
- Generated component must be fully working and ready to use, it will be inserted without props, just as like "<Component />"
- For application UI components, prioritize using shadcn components as a foundation
- For marketing components, you have more creative freedom
- IMPORTANT: Carefully analyze the structure, styling patterns, and component composition from the reference examples

Return Format:
Return ONE complete TypeScript/TSX file that includes:
1. ALL necessary imports (from external libraries like framer-motion, etc.)
2. The FULL implementation of ANY custom components used (including those found in reference examples)
3. The main component implementation
4. A usage example with \`export default\`

Instructions:
1. Thoroughly analyze the reference components provided - these are your primary inspiration
2. Identify patterns, styling approaches, and component structures from these examples
3. If using components from references that aren't in the default list, include their COMPLETE implementation code
4. NEVER import a component from "@/components/ui/" unless it's in the default list provided above
5. SCAN the entire file for duplicate declarations before finalizing
6. REVIEW the final code to ensure it's TypeScript-valid with no duplications or runtime issues

User Message:
\`\`\`
${message}
\`\`\`

Reference Components:
\`\`\`
${components}
\`\`\`

Generate a single valid, complete TypeScript/TSX file that includes ALL necessary code to make the component work. The file must include both the component implementation and a usage example with \`export default\`. Answer should contain only the code with no additional text or comments.
`
}

export const generateComponentWithoutReferencePrompt = (message: string) => {
  return `
Generate a complete, production-ready UI component based on the user's request using modern web development best practices.

Technical Requirements:
- Use TypeScript/TSX with proper type definitions
- Use Tailwind CSS for all styling
- Use shadcn/ui theming variables (bg-background, text-foreground, border-border, primary colors, etc.)

- Icons must be from 'lucide-react' or '@remixicon/react' only

Component Usage Rules:
1. DEFAULT shadcn/ui components (import without implementation):
'accordion', 'alert-dialog', 'alert', 'aspect-ratio', 'avatar', 'badge', 'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'collapsible', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input-otp', 'input', 'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster', 'toggle-group', 'toggle', 'tooltip', 'use-mobile'

2. For ANY custom component not in the above list:
   - Include its COMPLETE implementation in the output file
   - Do NOT attempt to import it from external sources

3. External libraries allowed: framer-motion, react-hook-form, zod, date-fns, etc.

Code Quality Requirements:
- NO duplicate component/function/variable names in the entire file
- Proper TypeScript interfaces for all props and data structures
- All imports must be valid and correctly referenced
- Only ONE default export per file
- Follow React Hooks rules strictly
- Include default prop values for standalone preview

Output Requirements:
Return a SINGLE complete TSX file containing:
1. All necessary imports
2. TypeScript interfaces/types
3. Full implementation of custom components (if any)
4. Main component implementation
5. Default export with usage example: export default ComponentName

Design Thinking:
Before coding, understand the context and commit to a BOLD aesthetic direction:
- Purpose: What problem does this interface solve? Who uses it?
- Tone: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- Differentiation: What makes this UNFORGETTABLE? What's the one thing someone will remember?
CRITICAL: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Frontend Aesthetics Guidelines:
- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- Spatial Composition: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- Backgrounds & Visual Details: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. Never settle on the first common choice that comes to mind. If a font, color, or layout feels like an obvious solution, deliberately explore alternatives.

IMPORTANT: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Component Quality:
- Ensure full responsiveness across all screen sizes
- Include proper hover, focus, and active states
- Follow accessibility best practices (ARIA labels, keyboard navigation)
- Handle edge cases (empty states, loading, errors)
- Make components reusable with customizable props

Development Approach:
1. Analyze the user's request to understand core functionality
2. Commit to a bold, distinctive aesthetic direction
3. Plan component structure and required sub-components
4. Implement with clean, maintainable code
5. Ensure the component works standalone without external props
6. Verify all code is TypeScript-valid with no runtime issues

User Request:
\`\`\`
${message}
\`\`\`

Generate the complete TSX file. Output ONLY the code, no explanations or comments outside the code.
`
}

export const generateComponentWithoutReferenceWithoutStyleBiasPrompt = (
  message: string,
) => {
  return `Generate a complete, production-ready UI component based on the user's request using modern web development best practices.

  Technical Requirements:
  - Use TypeScript/TSX with proper type definitions
  - Use Tailwind CSS for all styling

  - Icons must be from 'lucide-react' or '@remixicon/react' only
  
  Component Usage Rules:
  1. For ANY custom component not in the above list:
     - Include its COMPLETE implementation in the output file
     - Do NOT attempt to import it from external sources
  
  2. External libraries allowed: framer-motion, react-hook-form, zod, date-fns, etc.
  
  Code Quality Requirements:
  - NO duplicate component/function/variable names in the entire file
  - Proper TypeScript interfaces for all props and data structures
  - All imports must be valid and correctly referenced
  - Only ONE default export per file
  - Follow React Hooks rules strictly
  - Include default prop values for standalone preview
  
  Output Requirements:
  Return a SINGLE complete TSX file containing:
  1. All necessary imports
  2. TypeScript interfaces/types
  3. Full implementation of custom components (if any)
  4. Main component implementation
  5. Default export with usage example: export default ComponentName
  
  Component Design Principles:
  - Create modern, visually appealing interfaces
  - Ensure full responsiveness across all screen sizes
  - Include proper hover, focus, and active states
  - Implement smooth transitions and animations where appropriate
  - Follow accessibility best practices (ARIA labels, keyboard navigation)
  - Handle edge cases (empty states, loading, errors)
  - Make components reusable with customizable props
  
  Development Approach:
  1. Analyze the user's request to understand core functionality
  2. Plan component structure and required sub-components
  3. Implement with clean, maintainable code
  4. Ensure the component works standalone without external props
  5. Verify all code is TypeScript-valid with no runtime issues
  
  User Request:
  \`\`\`
  ${message}
  \`\`\`
  
  Generate the complete TSX file. Output ONLY the code, no explanations or comments outside the code.
  `
}

export const fixInvalidCodePrompt = (code: string, errorMessage: string) => {
  return `
# Fix TypeScript React Code Error

You are a TypeScript and React expert. Your task is to fix the code below that contains a TypeScript error.

## Code with Error

\`\`\`tsx
${code}
\`\`\`

## Error Message
\`\`\`
${errorMessage}
\`\`\`


## Instructions
1. Analyze the error message and identify the root cause
2. Fix the code to resolve the error
3. YOU CAN ONlLY EDIT THIS FILE, YOU CAN'T AFFECT ANY OTHER FILES, WE DON'Y HAVE ANy OTHER IMPORT AND COMPONENTS IN FILE DIRECTORY ONLY demo.tsx THAT YOU'RE PROVIDED WITH
$. Return ONLY the complete fixed code with no explanations or markdown

The fixed code must be valid TypeScript React that resolves the error while preserving the original functionality.  
`
}

export const enhancePrompt = (message: string) => {
  return `
  You are an expert prompt enhancer specializing in user experience design. Transform the given original prompt into a comprehensive, detailed enhanced prompt following these guidelines:

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Design Requirements:
- Specify that the design should be "modern and visually appealing"
- Require responsive design that "adapts to different screen sizes"
- Include visual states (hover, active, focus) where applicable
- Mention specific design considerations (spacing, typography, layout)

3. User Experience:
- Add interactive elements and visual feedback
- Specify smooth transitions and animations where appropriate
- Include accessibility features (keyboard navigation, screen reader support)
- Handle loading states and user feedback
- Provide clear visual hierarchy and intuitive navigation

4. Edge Cases & States:
- Handle edge cases (empty states, errors, large datasets)
- Include proper error handling and user messaging
- Specify loading and success states
- Consider various content scenarios

Format the enhanced prompt in 2-3 sentences, no more. That flows naturally, starting with "Create a [component/feature] that..." Include all relevant functional and user experience details while maintaining readability.

Original prompt: ${message}

`
}

export const enhancePromptModernMinimalist = (message: string) => {
  return `You are an expert prompt enhancer specializing in modern minimal web design. Transform the given original prompt into a comprehensive, detailed enhanced prompt that embraces clean aesthetics, purposeful whitespace, and refined simplicity.

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Modern Minimal Design Requirements:
- Use generous whitespace with padding classes like p-8, p-12, or p-[50px]
- Implement monochromatic color schemes with subtle neutral variations (gray-50 to gray-900)
- Add single accent colors sparingly for important actions
- Create clean lines with minimal borders using border-[0.5px] or border-gray-200
- Use subtle shadows with shadow-sm or custom shadow-[0_1px_3px_rgba(0,0,0,0.1)]
- Implement perfect geometric shapes and consistent spacing
- Design with mobile-first responsive approach using container and max-w-* classes

3. Typography & Visual Hierarchy:
- Use clean, modern font stacks with font-['Inter'] or font-['Helvetica_Neue']
- Implement clear hierarchy with limited font sizes (text-sm, text-base, text-3xl)
- Add generous line-height with leading-relaxed or leading-[1.8]
- Use font weights strategically (font-light for body, font-medium for emphasis)
- Include careful letter-spacing with tracking-wide for headlines
- Implement subtle text colors like text-gray-600 for secondary content

4. User Experience:
- Create gentle hover states with hover:bg-gray-50 or hover:bg-[#fafafa]
- Add micro-animations using transition-all duration-200 ease-in-out
- Include subtle focus states with focus:outline-none focus:ring-2 focus:ring-offset-2
- Implement invisible but present interactive areas with p-4 -m-4
- Use opacity changes for disabled states with opacity-60

5. Technical Implementation:
- Use CSS Grid and Flexbox with grid-cols-* and flex for precise layouts
- Implement consistent spacing scale (space-y-4, gap-6)
- Add responsive breakpoints with sm:, md:, lg: prefixes
- Use aspect-ratio utilities for maintaining proportions
- Include performance optimizations with will-change-[transform]

Format the enhanced prompt as a single paragraph that emphasizes the "less is more" philosophy while ensuring every element serves a clear purpose.

Original prompt: ${message}
`
}

export const enhancePromptGlassmorphic = (message: string) => {
  return `
  You are an expert prompt enhancer specializing in glassmorphic web design using Tailwind CSS. Transform the given original prompt into a comprehensive, detailed enhanced prompt that creates stunning glass-like effects using Tailwind utilities and arbitrary values.

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Glassmorphic Design Requirements with Tailwind:
- Implement glass effects using bg-white/10 or bg-[rgba(255,255,255,0.1)] for panels
- Add backdrop blur with backdrop-blur-md or backdrop-blur-[12px]
- Create glass borders with border border-white/20 or border-[rgba(255,255,255,0.2)]
- Use layered backgrounds with bg-gradient-to-br from-[#667eea] to-[#764ba2]
- Add soft glows with shadow-[0_8px_32px_rgba(31,38,135,0.37)]
- Implement multiple glass layers with varying bg-white/5, bg-white/10, bg-white/20
- Create depth with transform-gpu translate-z-0 for hardware acceleration

3. Visual Effects & Atmosphere:
- Add shimmer effects with bg-gradient-to-r from-transparent via-white/10 to-transparent
- Include animated gradients using bg-[length:200%_200%] animate-[gradient_15s_ease_infinite]
- Implement glass refraction with hover:backdrop-blur-[20px] transitions
- Use overlay gradients with before:absolute before:inset-0 before:bg-gradient-to-t
- Add floating particles with absolute elements and animate-[float_6s_ease-in-out_infinite]

4. User Experience:
- Create depth layers with z-10, z-20, z-30 for proper stacking
- Add glass morphing with hover:bg-white/20 hover:backdrop-blur-xl
- Include reveal animations with opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]
- Implement dynamic backgrounds with bg-[radial-gradient(circle_at_20%_50%,_#667eea,_transparent_50%)]

5. Technical Tailwind Implementation:
- Use backdrop-filter utilities with backdrop-blur-*, backdrop-brightness-*
- Layer multiple backgrounds with before: and after: pseudo-elements
- Ensure contrast with text-white/90 or text-[rgba(255,255,255,0.95)]
- Add fallbacks with supports-[backdrop-filter]:backdrop-blur-md
- Optimize with transform-gpu and will-change-[transform,opacity]

Format the enhanced prompt as a single paragraph emphasizing the ethereal, translucent nature achievable with Tailwind's backdrop utilities and arbitrary values.

Original prompt: ${message}
`
}

export const enhancePromptBrutalist = (message: string) => {
  return `
  You are an expert prompt enhancer specializing in brutalist web design using Tailwind CSS. Transform the given original prompt into a comprehensive, detailed enhanced prompt that creates raw, bold interfaces using Tailwind utilities and arbitrary values.

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Brutalist Design Requirements with Tailwind:
- Use harsh contrasts with bg-black text-white or bg-[#ff0000] text-black
- Implement broken layouts with transform rotate-[-2deg] or skew-x-[5deg]
- Add thick borders with border-[8px] border-black or border-[#00ff00]
- Create raw shapes with clip-path-[polygon(0_0,100%_0,95%_100%,0%_100%)]
- Use solid colors only: bg-[#ffff00], bg-[#ff00ff], bg-[#00ffff]
- Implement stark dividers with divide-y-[4px] divide-black
- Add intentional misalignment with translate-x-[3px] translate-y-[-5px]

3. Typography & Layout:
- Use massive type with text-[120px] leading-[0.8] font-black
- Mix fonts with font-['Courier_New'] and font-['Arial_Black']
- Implement overlapping with absolute -mt-[50px] or ml-[-20px]
- Add rotated text with rotate-[90deg] or rotate-[-45deg]
- Include monospace sections with font-mono text-[#00ff00] bg-black
- Use uppercase with uppercase tracking-[0.2em]

4. User Experience:
- Create jarring hovers with hover:invert hover:scale-[1.1]
- Add instant transitions with transition-none or duration-0
- Include glitch effects with hover:translate-x-[2px] hover:text-[#ff00ff]
- Implement color flashing with animate-[flash_0.5s_step-end_infinite]
- Use outline text with text-stroke-[2px] text-stroke-black

5. Raw Technical Elements with Tailwind:
- Show grid with bg-[repeating-linear-gradient(0deg,#000,#000_1px,transparent_1px,transparent_20px)]
- Add noise texture with bg-[url('data:image/svg+xml,...')] for static effect
- Include system UI with font-['system-ui'] border-[3px] border-[#c0c0c0]
- Implement terminal style with bg-black text-[#00ff00] font-mono p-[20px]
- Show construction lines with outline outline-[1px] outline-dashed outline-[#ff0000]

Format the enhanced prompt as a single paragraph that embraces anti-design principles while using Tailwind's arbitrary value system for maximum visual disruption.

Original prompt: ${message}
`
}

export const enhancePromptNeumorphic = (message: string) => {
  return `
  You are an expert prompt enhancer specializing in neumorphic (soft UI) web design using Tailwind CSS. Transform the given original prompt into a comprehensive, detailed enhanced prompt that creates soft, extruded interfaces using Tailwind utilities and arbitrary values.

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Neumorphic Design Requirements with Tailwind:
- Use soft shadows with shadow-[9px_9px_16px_#d1d1d1,-9px_-9px_16px_#ffffff]
- Implement monochromatic backgrounds with bg-[#e0e0e0] or bg-[#f0f0f0]
- Add dual shadows for depth with shadow-[inset_4px_4px_8px_#cbcbcb,inset_-4px_-4px_8px_#ffffff]
- Create rounded surfaces with rounded-[20px] or rounded-[50px]
- Use subtle gradients with bg-gradient-to-br from-[#e0e0e0] to-[#f5f5f5]
- Implement pressed states with shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]
- Design cohesive surfaces with consistent bg-[#e0e0e0] throughout

3. Depth & Lighting Effects:
- Add convex elements with shadow-[12px_12px_20px_#bebebe,-12px_-12px_20px_#ffffff]
- Implement concave elements with shadow-[inset_8px_8px_16px_#cbcbcb,inset_-8px_-8px_16px_#ffffff]
- Create elevation levels with shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] for raised
- Use inner shadows for inputs with shadow-[inset_2px_2px_5px_#b8b8b8,inset_-2px_-2px_5px_#ffffff]
- Add rim lighting with border-[1px] border-[#f8f8f8]
- Implement ambient shadows with shadow-[0_0_0_1px_rgba(255,255,255,0.1)]

4. User Experience:
- Create press animations with active:shadow-[inset_4px_4px_8px_#cbcbcb,inset_-4px_-4px_8px_#ffffff]
- Add smooth morphing with transition-[box-shadow] duration-300 ease-in-out
- Include hover elevation with hover:shadow-[14px_14px_28px_#bebebe,-14px_-14px_28px_#ffffff]
- Implement subtle feedback with active:scale-[0.98]
- Use consistent lighting angle throughout all elements

5. Technical Tailwind Implementation:
- Use arbitrary shadow values for precise neumorphic effects
- Implement proper contrast with text-gray-700 on bg-[#e0e0e0]
- Add focus states with focus:outline-none focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]
- Include accessible alternatives with dark:shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#2a2a2a]
- Optimize with transform-gpu for smooth transitions

Format the enhanced prompt as a single paragraph that emphasizes the soft, tactile nature of neumorphism achievable through Tailwind's arbitrary value system for shadows and colors.

Original prompt: ${message}
`
}

export const enhancePromptLinear = (message: string) => {
  return `
  You are an expert prompt enhancer specializing in Linear's signature design system. Transform the given original prompt into a comprehensive, detailed enhanced prompt that captures Linear's sophisticated, technical aesthetic with subtle gradients and precise craftsmanship.

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Linear Design Requirements:
- Use subtle gradient backgrounds with bg-gradient-to-b from-gray-50 to-white or bg-[radial-gradient(ellipse_at_top,_#f9fafb_0%,_#ffffff_100%)]
- Implement precise 1px borders with border border-gray-200/50 or border-[#e5e7eb33]
- Add subtle gradient overlays on cards with before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
- Create depth with layered shadows shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.04)]
- Use muted color palette with gray-900 for primary text and gray-500 for secondary
- Implement subtle backdrop blurs with backdrop-blur-[2px] for overlays
- Add delicate hover gradients with hover:bg-gradient-to-b hover:from-gray-50/50 hover:to-white

3. Typography & Interface Details:
- Use tight, precise typography with font-['Inter'] text-[13px] leading-[1.5]
- Implement consistent weight hierarchy with font-medium for labels, font-normal for values
- Add subtle text shadows for depth with [text-shadow:0_1px_2px_rgba(0,0,0,0.04)]
- Use tabular numbers for data with font-feature-settings-['tnum']
- Include keyboard shortcuts styled with kbd elements bg-gray-100 text-[11px] px-1.5 rounded
- Implement dot separators with before:content-['•'] before:mx-2 before:text-gray-400

4. User Experience:
- Create smooth, subtle transitions with transition-all duration-150 ease-out
- Add micro-interactions on hover with hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.08)]
- Include focus states with focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
- Implement pressed states with active:scale-[0.99] active:shadow-[0_1px_2px_rgba(0,0,0,0.08)]
- Use loading skeletons with animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100

5. Technical Implementation:
- Layer UI elements with relative z-10 for proper stacking
- Use CSS Grid for precise layouts with grid grid-cols-[auto_1fr_auto] items-center
- Add overflow gradients with before:absolute before:h-6 before:bg-gradient-to-b before:from-white before:to-transparent
- Implement custom scrollbars with scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
- Include performance optimizations with transform-gpu for animations

Format the enhanced prompt as a single paragraph that captures Linear's meticulous attention to detail and sophisticated minimalism.

Original prompt: ${message}
`
}

export const enhancePromptVercel = (message: string) => {
  return `
  You are an expert prompt enhancer specializing in Vercel's distinctive design language. Transform the given original prompt into a comprehensive, detailed enhanced prompt that embodies Vercel's geometric precision, bold contrasts, and developer-focused aesthetics.

1. Core Functionality:
- Expand the basic request into specific, actionable features
- Break down the component/feature into its essential parts
- Include all standard functionality users would expect

2. Vercel Design Requirements:
- Use stark black and white contrasts with bg-black text-white or bg-white text-black
- Implement geometric borders with border-2 border-black or border-[#000000]
- Add distinctive shadows with shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] on light backgrounds
- Create "lifted" elements with hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5
- Use accent colors sparingly: blue-500 for links, green-500 for success, red-500 for errors
- Implement sharp corners with rounded-none or subtle rounding with rounded-[4px]
- Add geometric patterns with bg-[linear-gradient(45deg,#f4f4f4_25%,transparent_25%,transparent_75%,#f4f4f4_75%,#f4f4f4)]

3. Typography & Visual Language:
- Use clean sans-serif with font-['Geist'] or font-['system-ui'] text-[14px]
- Implement bold headings with font-bold text-[32px] leading-[1.2] tracking-tight
- Add monospace elements for code with font-mono bg-gray-100 px-1 py-0.5 rounded-[3px]
- Use ALL CAPS sparingly with uppercase text-[11px] tracking-[0.1em] font-semibold
- Include gradient text effects with bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600
- Implement consistent spacing with space-y-2 for tight, space-y-8 for sections

4. User Experience:
- Create instant feedback with hover:bg-black hover:text-white transition-colors duration-100
- Add distinctive focus states with focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
- Include loading dots with animate-[loading_1.4s_ease-in-out_infinite] for each dot
- Implement toggle states with data-[state=active]:bg-black data-[state=active]:text-white
- Use skeleton states with bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]

5. Technical Implementation:
- Use CSS variables for theming with [--primary:#000] [--background:#fff]
- Implement responsive grid with grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Add container constraints with max-w-[1200px] mx-auto px-6
- Include motion preferences with motion-safe:transition-all motion-reduce:transition-none
- Optimize with font-display-swap will-change-transform for performance

Format the enhanced prompt as a single paragraph that captures Vercel's bold, geometric aesthetic and developer-first approach.

Original prompt: ${message}
`
}

export const generateComponentUpdateWithReferencePrompt = (
  existingCode: string,
  userMessage: string,
  referenceComponents: string,
) => {
  return `
You are updating an existing UI component based on user feedback. You have reference components available for inspiration.

EXISTING COMPONENT TO UPDATE:
\`\`\`tsx
${existingCode}
\`\`\`

USER REQUEST FOR CHANGES:
\`\`\`
${userMessage}
\`\`\`

REFERENCE COMPONENTS FOR INSPIRATION:
${referenceComponents}

UPDATE GUIDELINES:
1. ANALYZE the reference components for relevant patterns, styles, and approaches
2. MAINTAIN the existing component's core architecture unless explicitly asked to change it
3. INTEGRATE ideas from reference components that help fulfill the user's request
4. PRESERVE all existing functionality unless explicitly asked to remove it
5. ENSURE compatibility between new patterns and existing code

CRITICAL REQUIREMENTS (MUST BE MAINTAINED):

Technical Stack:
- TypeScript/TSX with proper type definitions
- Tailwind CSS for ALL styling (no inline styles, no CSS modules)
- shadcn/ui theming variables (bg-background, text-foreground, border-border, primary colors, etc.)

- Icons from 'lucide-react' or '@remixicon/react' ONLY

Import Rules:
1. DEFAULT shadcn/ui components (import without implementation):
'accordion', 'alert-dialog', 'alert', 'aspect-ratio', 'avatar', 'badge', 'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'collapsible', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input-otp', 'input', 'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster', 'toggle-group', 'toggle', 'tooltip', 'use-mobile'

2. Custom components NOT in the above list:
   - MUST include COMPLETE implementation in the output file
   - NEVER import from external sources

3. Allowed external libraries: framer-motion, react-hook-form, zod, date-fns, etc.

Code Structure Requirements:
- NO duplicate component/function/variable names
- Maintain TypeScript interfaces for all props and data
- All imports must be valid and correctly referenced
- Only ONE default export per file
- Follow React Hooks rules
- Preserve default prop values for standalone preview

Integration Approach:
1. IDENTIFY patterns in reference components that address the user's request
2. ADAPT those patterns to fit the existing component structure
3. MERGE styles and approaches thoughtfully, not blindly copying
4. ENSURE visual and functional coherence between old and new code
5. TEST that all existing features still work after updates

Quality Standards:
- Maintain modern, visually appealing design
- Ensure responsiveness across all devices
- Include proper interactive states (hover, focus, active)
- Implement smooth transitions and animations
- Follow accessibility best practices
- Handle edge cases appropriately

Output Requirements:
Return the COMPLETE updated TSX file containing:
1. All necessary imports (updated if needed)
2. TypeScript interfaces/types (updated if needed)
3. Full implementation of custom components (updated if needed)
4. Updated main component implementation
5. Default export with usage example

IMPORTANT: Output ONLY the complete updated code. Do not include explanations, comments about changes, or anything outside the TSX code block.
`
}

export const generateComponentUpdatePrompt = (
  existingCode: string,
  userMessage: string,
) => {
  return `
You are updating an existing UI component based on user feedback. You must maintain the exact same technical architecture and requirements while implementing the requested changes.

EXISTING COMPONENT:
\`\`\`tsx
${existingCode}
\`\`\`

USER REQUEST FOR CHANGES:
\`\`\`
${userMessage}
\`\`\`

CRITICAL REQUIREMENTS (MUST BE MAINTAINED):

Technical Stack:
- TypeScript/TSX with proper type definitions
- Tailwind CSS for ALL styling (no inline styles, no CSS modules)
- shadcn/ui theming variables (bg-background, text-foreground, border-border, primary colors, etc.)

- Icons from 'lucide-react' or '@remixicon/react' ONLY

Import Rules:
1. DEFAULT shadcn/ui components (import without implementation):
'accordion', 'alert-dialog', 'alert', 'aspect-ratio', 'avatar', 'badge', 'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox', 'collapsible', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'form', 'hover-card', 'input-otp', 'input', 'label', 'menubar', 'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster', 'toggle-group', 'toggle', 'tooltip', 'use-mobile'

2. Custom components NOT in the above list:
   - MUST include COMPLETE implementation in the output file
   - NEVER import from external sources

3. Allowed external libraries: framer-motion, react-hook-form, zod, date-fns, etc.

Code Structure Requirements:
- NO duplicate component/function/variable names
- Maintain TypeScript interfaces for all props and data
- All imports must be valid and correctly referenced
- Only ONE default export per file
- Follow React Hooks rules
- Preserve default prop values for standalone preview

Update Guidelines:
1. PRESERVE the existing component architecture unless specifically asked to change it
2. MAINTAIN all existing functionality unless explicitly asked to remove it
3. ADD new features without breaking existing ones
4. KEEP the same file structure (single TSX file with all implementations)
5. UPDATE only the parts necessary to fulfill the user's request
6. ENSURE the component still works standalone without external props

Quality Standards:
- Maintain modern, visually appealing design
- Ensure responsiveness across all devices
- Include proper interactive states (hover, focus, active)
- Implement smooth transitions and animations
- Follow accessibility best practices
- Handle edge cases appropriately

Output Requirements:
Return the COMPLETE updated TSX file containing:
1. All necessary imports (updated if needed)
2. TypeScript interfaces/types (updated if needed)
3. Full implementation of custom components (updated if needed)
4. Updated main component implementation
5. Default export with usage example

IMPORTANT: Output ONLY the complete updated code. Do not include explanations, comments about changes, or anything outside the TSX code block.
`
}

export const generateComponentUpdateDiffPrompt = (
  existingCode: string,
  userMessage: string,
  referenceComponents?: string,
) => {
  return `You are an expert TypeScript/React developer. Update the following component based on the user's request using ONLY SEARCH/REPLACE blocks.

EXISTING COMPONENT:
\`\`\`tsx
${existingCode}
\`\`\`

USER REQUEST:
${userMessage}

${
  referenceComponents
    ? `REFERENCE COMPONENTS FOR INSPIRATION:
${referenceComponents}

Use patterns, styles, and approaches from these reference components where relevant to fulfill the user's request.
`
    : ""
}

IMPORTANT: Respond with ONLY SEARCH/REPLACE blocks. Do not include any explanations or comments outside the blocks.

Use this exact format for each change:

<<<<<<< SEARCH
exact code to search for
=======
code to replace with
>>>>>>> REPLACE

Critical rules:
  1. SEARCH content must match the associated file section to find EXACTLY:
     * Match character-for-character including whitespace, indentation, line endings
     * Include all comments, docstrings, etc.
  2. SEARCH/REPLACE blocks will ONLY replace the first match occurrence.
     * Including multiple unique SEARCH/REPLACE blocks if you need to make multiple changes.
     * Include *just* enough lines in each SEARCH section to uniquely match each set of lines that need to change.
     * When using multiple SEARCH/REPLACE blocks, list them in the order they appear in the file.
  3. Keep SEARCH/REPLACE blocks concise:
     * Break large SEARCH/REPLACE blocks into a series of smaller blocks that each change a small portion of the file.
     * Include just the changing lines, and a few surrounding lines if needed for uniqueness.
     * Do not include long runs of unchanging lines in SEARCH/REPLACE blocks.
     * Each line must be complete. Never truncate lines mid-way through as this can cause matching failures.
  4. Special operations:
     * To move code: Use two SEARCH/REPLACE blocks (one to delete from original + one to insert at new location)
     * To delete code: Use empty REPLACE section

Examples:

<<<<<<< SEARCH
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> REPLACE

<<<<<<< SEARCH
function handleSubmit() {
  saveData();
  setLoading(false);
}

=======
>>>>>>> REPLACE

<<<<<<< SEARCH
return (
  <div>
=======
function handleSubmit() {
  saveData();
  setLoading(false);
}

return (
  <div>
>>>>>>> REPLACE


Now generate the SEARCH/REPLACE blocks for the requested changes:`
}

export const generateComponentUpdateDiffWithDescriptionPrompt = (
  existingCode: string,
  userMessage: string,
  referenceComponents?: string,
  messageHistory?: Array<{ role: string; content: string }>,
) => {
  const historyContext =
    messageHistory && messageHistory.length > 0
      ? `
DIALOGUE HISTORY:
${messageHistory.map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n")}
`
      : ""

  return `You are an expert TypeScript/React developer and a helpful assistant. Update the following component based on the user's request.

${historyContext}

EXISTING COMPONENT:
\`\`\`tsx
${existingCode}
\`\`\`

USER REQUEST:
${userMessage}

${
  referenceComponents
    ? `REFERENCE COMPONENTS FOR INSPIRATION:
${referenceComponents}

Use patterns, styles, and approaches from these reference components where relevant to fulfill the user's request.
`
    : ""
}

Your response must have TWO parts:

PART 1 - ASSISTANT MESSAGE:
Write a friendly, conversational message (2-3 sentences) that:
- Acknowledges what the user asked for
- Briefly describes what changes you're making
- Uses natural language as if you're chatting with a colleague
- Be specific about the changes but keep it concise
- If referring to previous messages, acknowledge that context

Start this section with "ASSISTANT_MESSAGE_START" and end with "ASSISTANT_MESSAGE_END"

PART 2 - CODE CHANGES:
Provide SEARCH/REPLACE blocks for the code changes.

Use this exact format for each change:

<<<<<<< SEARCH
exact code to search for
=======
code to replace with
>>>>>>> REPLACE

Critical rules for SEARCH/REPLACE blocks:
  1. SEARCH content must match EXACTLY (including whitespace, indentation)
  2. Each block replaces only the FIRST match
  3. Keep blocks concise - include just enough context for unique matching
  4. List blocks in the order they appear in the file
  5. To delete code: Use empty REPLACE section

Example response format:

ASSISTANT_MESSAGE_START
I'll add the hover animation you requested to make the button more interactive. I'm applying a scale transform and shadow effect that will give it a nice lift on hover.
ASSISTANT_MESSAGE_END

<<<<<<< SEARCH
<button className="px-4 py-2 bg-blue-500 text-white rounded">
=======
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:scale-105 hover:shadow-lg transition-all duration-200">
>>>>>>> REPLACE

Now generate your response:`
}

export const buildPromptWithHistory = (
  basePrompt: string,
  history: Array<{ role: string; content: string }>,
  currentUserMessage: string,
): string => {
  if (!history || history.length === 0) {
    return basePrompt
  }

  let historyContext = "Previous conversation:\n"
  history.forEach(({ role, content }) => {
    historyContext += `${role === "user" ? "User" : "Assistant"}: ${content}\n`
  })
  historyContext += `\nCurrent user message: ${currentUserMessage}\n\n`

  return historyContext + basePrompt
}

export const generateComponentCopyPrompt = (
  projectName: string,
  componentContext: string,
) => {
  return `You are tasked with creating an exact copy of an existing UI demo & component, you're provided with demo, component, and code for related sub-components.

Project: "${projectName}"

Component to copy:
${componentContext}

CRITICAL INSTRUCTIONS:
1. If there's multiple demos, copy only the first one
1. Create an EXACT copy of the provided component code
2. Do NOT modify, improve, or change anything
3. Keep ALL imports, types, props, and functionality exactly as they are
4. Preserve all styling, animations, and interactions
5. Include all helper functions and utilities
6. Maintain the exact same file structure

IMPORTANT:
- you can only return one file, so you can't import other components, they should be in the same file, for relative components just write them in the SAME file
- ENSURE only ONE default export in the entire file, for the DEMO
- make sure that is' valid TSX and nothing is broken
- if you meet custom css, or CUSTOM Tailwind properties (such as animation, transitions, etc) use it in styled-jsx global \`<style jsx global>\` tag inside inside parent component. you must add styles since they are important for the demo. Keep in mind that we already have itialized tailwind in the demo that reuse most of the styles, so you need to make it only for custom caes.

Generate a single valid, complete TypeScript/TSX file that includes ALL necessary code to make the demo work that looks exactly like the demo. The file must include both the component implementation and a demo example with \`export default\`. Answer should contain only the code with no additional text or comments.`
}

export {
  generateComponentWithTagContext,
  getComponentFilterPromptByTags,
  getTagSelectionPrompt,
} from "./sergey.prompt"

export const generateProjectNamePrompt = (userMessage: string) => {
  return `You are an expert at creating concise, descriptive project names. Generate a short, meaningful name for a UI/web development project based on the user's initial request.

Guidelines:
- Keep it under 50 characters
- Use clear, descriptive words that capture the essence of the project
- Avoid generic terms like "app", "website", "project" unless specifically relevant
- Focus on the main functionality, purpose, or key feature
- Use sentence case format - only capitalize the first word and proper nouns (e.g., "E-commerce dashboard", "Task manager")
- Be creative but professional
- Consider the target audience and use case
- Do NOT use quotation marks in the response
- Return plain text without any formatting

Examples of good project names:
- Portfolio showcase (for personal portfolio)
- Recipe finder (for recipe app)
- Team collaboration hub (for team tools)
- Expense tracker (for finance management)
- Property listings (for real estate)
- Learning platform (for educational content)
- Event scheduler (for calendar/booking)

User Request:
"${userMessage}"

Return ONLY the project name without quotes, no additional text or explanation.`
}

export const generateShapeSizePrompt = (userMessage: string) => {
  return `Determine the optimal canvas size for this UI project and respond with JSON:

"${userMessage}"

Available options:
- desktop (1440×900): Desktop layouts, web pages, dashboards, admin panels, landing pages, any desktop/web interface
- mobile (375×812): Mobile apps, phone interfaces, mobile-specific designs

Choose "mobile" ONLY if the user explicitly mentions mobile, phone, iOS, Android, or mobile app.
For everything else (buttons, cards, forms, pages, dashboards, sections, components), use "desktop".

Examples:
- "Create a button" → desktop
- "Add a confirmation dialog" → desktop  
- "Build a mobile app login" → mobile
- "Design a hero section" → desktop
- "Create a landing page" → desktop
- "Build an admin dashboard" → desktop
- "Create an iOS app" → mobile
- "Design a phone interface" → mobile

Return JSON with the field "sizeKey" containing one of: desktop, mobile.

Example response: {"sizeKey": "desktop"}`
}

export const verifyComponentCopiedCode = (
  componentCode: string,
  componentContext: string,
) => {
  return `You are an expert TypeScript/React developer. Verify that the following component code is an exact copy of the provided component context.

  EXISTING COMPONENT:
  \`\`\`tsx
  ${componentContext}
  \`\`\`

  COMPONENT TO VERIFY:
  \`\`\`tsx
  ${componentCode}
  \`\`\`

  - it has exprot default
  - nothing is broken
  `
}
