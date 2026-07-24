# KI: ant-design/ant-design

## Overview
[Changelog](./CHANGELOG.en-US.md) · [Report Bug][github-issues-url] · [Request Feature][github-issues-url] · English · [中文](./README-zh_CN.md)

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 114 files across 32 directories
- **File types:** .ts: 31, .tsx: 23, .js: 17, .md: 17, .json: 12, .yml: 2, .less: 2

## Core Capabilities
- 🌈 Enterprise-class UI designed for web applications.
- 📦 A set of high-quality React components out of the box.
- 🛡 Written in TypeScript with predictable static types.
- ⚙️ Whole package of design resources and development tools.
- 🌍 Internationalization support for dozens of languages.
- 🎨 Powerful theme customization based on CSS-in-JS.

## Documentation Sections
- ❤️ Sponsors [![](https://opencollective.com/ant-design/tiers/sponsors/badge.svg?label=Sponsors&color=brightgreen)](https://opencollective.com/ant-design/contribute/sponsors-218)
- ✨ Features
- 🖥 Environment Support
- 📦 Install
- 🔨 Usage
- 🔗 Links
- ⌨️ Development
- 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
- Issue funding
- ❤️ Backers [![](https://opencollective.com/ant-design/tiers/backers/badge.svg?label=Backers&color=brightgreen)](https://opencollective.com/ant-design#support)

## Core Structure
```
  .antd-tools.config.js
  .depslintrc.js
  .dockerignore
  .dumirc.ts
  .editorconfig
  .fatherrc.ts
  .gitignore
  .gitpod.yml
  .jest.image.js
  .jest.js
  .jest.node.js
  .jest.site.js
  .lintstagedrc.json
  .ncurc.js
  .npmignore
  .npmrc
  .prettierignore
  .prettierrc
  .remarkrc.js
  .surgeignore
  AGENTS.md
  BUG_VERSIONS.json
  CHANGELOG.en-US.md
  CHANGELOG.zh-CN.md
  CLAUDE.md
  CNAME
  CODE_OF_CONDUCT.md
  LICENSE
  README-zh_CN.md
  README.md
  SECURITY.md
  biome.json
  codecov.yml
  contributors.json
  eslint.config.mjs
  index-style-only.js
  index-with-locales.js
  index.js
  jest-puppeteer.config.js
  mako.config.json
  package.json
  react-doctor.config.json
  renovate.json
  tsconfig-old-react.json
  tsconfig.json
  vitest.config.ts
  vitest.setup.ts
  webpack.config.js
  .agents/
    skills/
      changelog-collect/
        SKILL.md
      commit-msg/
        SKILL.md
        references/
          format-and-examples.md
      create-pr/
        SKILL.md
        references/
          template-notes-and-examples.md
      issue-reply/
        SKILL.md
        references/
          labels-and-resources.md
      test-review/
        SKILL.md
      version-release/
        SKILL.md
  .claude/
    skills
  .cursor/
    skills
  .devcontainer/
    devcontainer.json
  .dumi/
    global.less
    layer-import.less
    loading.js
    rehypeAntd.ts
    rehypeChangelog.ts
    remarkAnchor.ts
    remarkAntd.ts
    tsconfig.json
    hooks/
      useDark.tsx
      useIssueCount.ts
      useLayoutState.ts
      useLocalStorage.ts
      useLocale.ts
      useLocation.ts
      useMenu.tsx
      useThemeAnimation.ts
    pages/
      404/
        index.tsx
      index/
        index.tsx
        components/
          BannerRecommends.tsx
          BannerSponsors.tsx
          ComponentsList.tsx
          DesignFramework.tsx
          Group.tsx
          GroupMaskLayer.tsx
          SiteContext.ts
          util.ts
          PreviewBanner/
            LuminousBg.tsx
            index.tsx
          Theme/
            BackgroundImage.tsx
            ColorPicker.tsx
            MobileCarousel.tsx
            RadiusPicker.tsx
            ThemePicker.tsx
            colorUtil.ts
            index.tsx
          ThemePreview/
            ComponentsBlock.tsx
            index.tsx
            themeCodeUtils.ts
            previewThemes/
              bootstrapTheme.ts
              cartoonTheme.ts
              geekTheme.ts
              glassTheme.ts
              ill
```

## Quick Start
```bash
npm install antd
yarn add antd
pnpm add antd
bun add antd
- [Home page](https://ant.design/)
- [Components Overview](https://ant.design/components/overview)
- [Sponsor](https://ant.design/docs/react/sponsor)
- [Change Log](CHANGELOG.en-US.md)
- [rc-components](https://react-component.github.io/)
- [🆕 Ant Design X](https://x.ant.design/index-cn)
```

## Agent Configuration

--- AGENTS.md ---
CLAUDE.md

--- CLAUDE.md ---
# Ant Design 项目开发指南

> 本文件为 AI 编程助手提供项目上下文和开发规范。

## 项目信息

- React 组件库，发布为 npm 包 `antd`
- 使用 TypeScript 和 React 开发
- 采用 CSS-in-JS 架构（基于 `@ant-design/cssinjs`）
- 支持 Design Token 主题系统、暗色模式、RTL 布局、SSR、国际化（150+ 语言）

### 项目结构

```
ant-design/
├── components/              # 组件源代码（84+ 组件）
│   ├── component-name/      # 单个组件目录
│   │   ├── ComponentName.tsx      # 主组件实现
│   │   ├── demo/                  # 演示代码（*.tsx 和 *.md）
│   │   ├── style/                 # 样式系统（index.ts / token.ts）
│   │   ├── __tests__/            # 单元测试
│   │   ├── index.en-US.md        # 英文文档
│   │   ├── index.zh-CN.md        # 中文文档
│   │   └── index.tsx             # 导出入口
│   ├── _util/                   # 共享工具函数库
│   ├── theme/                   # 主题系统
│   └── locale/                  # 国际化文本
├── tests/                       # 测试工具和共享测试
├── docs/                        # 站点文档
├── CHANGELOG.zh-CN.md           # 中文更新日志
└── CHANGELOG.en-US.md           # 英文更新日志
```

---

## 通用编码规范

- 判断数据类型时，优先使用 `components/_util/is.ts` 中已有的方法，例如 `isNumber`、`isString`、`isPlainObject`、`isFunction`、`isThenable`、`isPrimitive`、`isNonNullable`。
- 仅当 `components/_util/is.ts` 中没有合适方法，或当前场景需要更严格、更特殊的判断逻辑时，再使用内联 `typeof`、`instanceof` 等判断方式。

---

## Demo 导入规范

- 常规 `components/**/demo/` 文件在引入 Ant Design 组件、组件内部模块、工具方法、变量、类型定义时，一律使用绝对路径导入，不使用相对路径导入。
- `components/**/demo/_semantic*.tsx` 属于语义文档专用 demo，是例外场景：允许通过相对路径引用 `.dumi/hooks/useLocale`、`.dumi/theme/common/*` 等站点侧辅助模块。
- `.dumi/` 目录内部的站点实现文件可按现有目录结构使用相对路径引用本目录模块；当引用仓库内 Ant Design 组件入口时，优先使用项目公开入口或已配置别名。
- 允许的导入形式应优先使用项目公开入口或已配置别名，例如：`antd`、`antd/es/*`、`antd/lib/*`、`antd/locale/*`、`@@/*`。
- `.dumi/*` 不是仓库通用的 TS 路径别名；如需引用 `.dumi` 内部模块，请按文件位置使用相对路径。
- 常规 demo 文件中，禁止使用 `..`、`../xxx`、`../../xxx`、`./xxx` 这类相对路径去引用组件实现、内部模块、方法、变量、类型，包含跨 demo、跨目录复用的场景。
- 常规 demo 与 `.dumi` 文件之间不要互相相对引用（`_semantic*.tsx` 等站点语义 demo 复用 `.dumi` 辅助模块除外）。如果需要复用少量逻辑，优先内联，或提取到可通过绝对路径访问的公共位置。

## Test 导入规范

- 本规范适用于 `components/**/__tests__/` 下的测试文件。
- 在这些目录下引入 Ant Design 组件，或引入组件内部模块、工具方法、变量、类型定义时，一律使用相对路径


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
