# KI: AykutSarac/jsoncrack-vscode

## Overview
This repository contains a Visual Studio Code extension named "JSON Crack" that allows users to visualize JSON data as diagrams within the editor. The core functionality is implemented using React and Mantine, with components for displaying graphs and managing node details.  The extension appears to be designed to enhance understanding and exploration of complex JSON structures.

## Tech Stack (from code)
- **TypeScript:** Extensive use of `.ts` and `.tsx` files throughout the `ext-src`, `jsoncrack`, and `src` directories, including `tsconfig.json`.
  ```typescript
  // tsconfig.json
  {
    "compilerOptions": {
      ...
      "jsx": "preserve",
      ...
    }
  }
  ```
- **React:** The presence of `.tsx` files and components like `App`, `NodeModal`, and `GraphView` indicates the use of React.
  ```typescript
  // src/App.tsx
  import { useEffect, useState } from "react";
  ...
  const App: React.FC = () => { ... }
  ```
- **Mantine:** Imports like `MantineProvider`, `Text`, and `Anchor` from `@mantine/core` confirm the use of Mantine UI components.
   ```typescript
   // src/App.tsx
   import { Anchor, Box, MantineProvider, Text } from "@mantine/core";
   ```
- **Webpack:** The presence of `webpack.config.cjs` and scripts using webpack suggests it's used for bundling the application.
  ```json
  // package.json
  "scripts": {
    "compile": "webpack --mode development --config webpack.config.cjs",
    "watch": "webpack --mode development --watch --config webpack.config.cjs",
    "package": "webpack --mode production --devtool hidden-source-map --config webpack.config.cjs"
  }
  ```

## Public API / Exports
Due to the nature of this being a VS Code extension, it's difficult to determine a clear public API without further investigation into how it interacts with the VS Code environment. However, based on `package.json` and source code:

- **Commands:** The `package.json` defines three commands: "jsoncrack-vscode.start", "jsoncrack-vscode.start.specific", and "jsoncrack-vscode.start.selected". These are likely the primary entry points for user interaction within VS Code.
  ```json
  // package.json
  "contributes": {
    "commands": [
      {
        "command": "jsoncrack-vscode.start",
        ...
      }
    ]
  }
  ```

## Dependencies
Based on `package.json`:

- `@mantine/core`: UI component library
- `@emotion/react`: Emotion styling utilities
- `@emotion/styled`: Emotion styling utilities
- react: React core library
- react-dom: React DOM library
- styled-components: CSS-in-JS library
- vsce: Visual Studio Code Extension Manager

## Architecture Patterns
- **Component-Based Architecture:** The application is structured using React components, promoting modularity and reusability.  For example, `NodeModal`, `GraphView`, and various sub-components within the `jsoncrack/features/editor/views/GraphView` directory.
- **State Management (using Hooks):** Custom hooks like `useGraph` and `useConfig` are used to manage application state. This suggests a functional component approach with custom hook logic for data handling.
  ```typescript
  // src/jsoncrack/features/editor/views/GraphView/stores/useGraph.ts
  const useGraph = (state => state.selectedNode);
  ```
- **Themeing:** The application utilizes a theme system, switching between light and dark modes based on the VS Code theme setting. This is evident in `src/App.tsx` where it dynamically selects themes.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS by providing:

- **Visualization Tools:** The JSON visualization capabilities can be integrated into SEOSONA OS for analyzing configuration files, data structures, or any other JSON-based content used within the operating system.
- **Component Library:**  The React components and Mantine UI elements demonstrate good practices in building user interfaces that could be reused or adapted within SEOSONA OS applications.
- **Themeing Implementation:** The dynamic theme switching logic can serve as a reference for implementing similar theming capabilities across different parts of the operating system.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `plugin`
- **All scores:** {'seosona-os': 41, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
