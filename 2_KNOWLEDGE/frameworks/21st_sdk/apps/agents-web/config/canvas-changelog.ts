import { ProcessedRelease } from "@/types/changelog"

/**
 * Local Canvas updates
 * These updates are shown only to users with access to Canvas
 */
export const canvasChangelog: ProcessedRelease[] = [
  {
    id: "canvas-0.2.2.25",
    version: "0.2.2.25",
    title:
      "Community previews, mobile dialog, onboarding emails, and users page",
    slug: "0-2-2-25",
    isCanvasUpdate: true,
    source: "canvas",
    content: `Community received new preview dialogs for components and screens, including a mobile-optimized version. We also added onboarding emails and a users page.

### What's new:
- Preview dialogs for components and screens (Community)
- Mobile version of the preview dialog (Community)
- Users page (Community)
- Onboarding emails: welcome on sign-up and a next-day "Try Magic" email

### Fixed:
- Excessive token usage when copying or cloning sites`,
    publishedAt: new Date("2025-08-31T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.24",
    version: "0.2.2.24",
    title: "Fix: chat message persistence after reload",
    slug: "0-2-2-24",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We fixed a chat issue where a newly sent message could be lost after a page reload.

### Fixed:
- Chat messages could disappear after reload right after sending`,
    publishedAt: new Date("2025-08-30T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.23",
    version: "0.2.2.23",
    title: "Community: bookmarks, command menu, and industry tags",
    slug: "0-2-2-23",
    isCanvasUpdate: true,
    source: "canvas",
    content: `Community updates: bookmarks for screens, a command search menu, and industry tags.

### What's new:
- Bookmarks for screens (Community)
- Command search menu (Community)
- Screens page with industry tags (Community)

### Improved:
- Header visuals`,
    publishedAt: new Date("2025-08-29T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.22",
    version: "0.2.2.22",
    title: "Chat stability, performance, and full-page Community view",
    slug: "0-2-2-22",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We improved Canvas chat stability and optimized UI performance, and added a toggle to expand Community to a full-page view.

### What's new:
- Toggle to collapse sidebar and expand Community to a full-page view

### Improved:
- Stability of Canvas chat
- UI performance by eliminating unnecessary re-renders`,
    publishedAt: new Date("2025-08-28T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.21",
    version: "0.2.2.21",
    title: "Community launch",
    slug: "0-2-2-21",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We launched the new Community. It includes four pillars for discovery and navigation.

### What's new:
- Components
- Screens
- Themes
- Command menu for searching across components, screens, and themes`,
    publishedAt: new Date("2025-08-27T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.20",
    version: "0.2.2.20",
    title: "Chat context shapes fix and Inspirations page improvements",
    slug: "0-2-2-20",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We fixed an issue where deleted shapes remained in chat context and improved the Inspirations page visuals (shipped version).

### Improved:
- Inspirations page visualization (live version)

### Fixed:
- Deleted shapes no longer remain in chat context`,
    publishedAt: new Date("2025-08-26T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.19",
    version: "0.2.2.19",
    title: "Explore, auth gate for copy, and Magic Chat fixes",
    slug: "0-2-2-19",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We introduced Explore, added an auth requirement for copying after the first attempt, and fixed multiple Magic Chat issues.

### What's new:
- Explore: generate multiple style variants and control divergence from the original
- Sign-in required when copying code or components (starting from the second attempt)

### Fixed:
- Default font not displayed
- Style application incorrectly inheriting across all variants
- "Remix with AI" button in Magic Chat
- Copy prompt in Magic Chat now includes dependencies, including Tailwind code`,
    publishedAt: new Date("2025-08-25T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.18",
    version: "0.2.2.18",
    title: "Inline mentions, Studio UX improvements, and fixes",
    slug: "0-2-2-18",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added inline mentions in Canvas chat, improved Studio interactions, and shipped multiple fixes.

### What's new:
- Inline mentions in Canvas chat input: use @ to mention components or search examples in Community
- Copy prompts optimized for Claude Code

### Improved:
- Studio header navigation
- Studio list behavior: row click opens component; separate button for editing

### Fixed:
- Open new project tabs via Command+Click
- Display of attached files in the chatbot
- Removed outdated bundles from Studio
- Hidden the Design Inspiration horizontal slider on the homepage`,
    publishedAt: new Date("2025-08-24T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.17",
    version: "0.2.2.17",
    title: "Canvas font update and stability",
    slug: "0-2-2-17",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We updated the font and made stability improvements.

### What's new:
- Updated font

### Improved:
- Stability improvements`,
    publishedAt: new Date("2025-08-23T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.16",
    version: "0.2.2.16",
    title: "Shaders section and code-aware inspiration tool",
    slug: "0-2-2-16",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added a Shaders section to Community and introduced a new inspiration tool that searches relevant code snippets in addition to UI components. This tool is integrated into Canvas chat.

### What's new:
- Shaders section in Community
- Inspiration tool that finds relevant code snippets alongside UI components (integrated into Canvas chat)`,
    publishedAt: new Date("2025-08-22T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.15",
    version: "0.2.2.15",
    title: "Auto snap, shape interactions, and intelligent sizing",
    slug: "0-2-2-15",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added auto snap for better shape alignment, improved shape interactions, and introduced intelligent shape sizing.

### What's new:
- Added Stripe customer portal in profile settings
- Added auto snap functionality - shapes now magnetically align to each other for easier placement
- Added command menu option to toggle auto snap on/off
- Added intelligent shape size determination - AI automatically selects optimal dimensions based on project type
- Added version restore confirmation dialog to prevent accidental rollbacks
- Improved shape name click behavior - single click selects shape, drag to move
- Enhanced copy prompt button with helpful tooltips and hotkey hints
- Added "Send now" functionality in message queues

### Fixed:
- Fixed version dialog crash that was breaking the page
- Fixed copy prompt button functionality and added proper tooltips`,
    publishedAt: new Date("2025-08-19T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.14",
    version: "0.2.2.14",
    title: "Inspiration dialog improvements and project previews",
    slug: "0-2-2-14",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We streamlined the inspiration dialog and added project preview functionality to the homepage.

### What's new:
- Updated inspiration dialog - now directly choose what to add instead of separate component/screen selection
- Added project preview cards on homepage with thumbnails from canvas variants
- Added token display in chat input showing remaining and spent tokens

### Improved:
- Streamlined inspiration workflow for faster component and screen addition

### Fixed:
- Fixed empty state for "My Themes" screen`,
    publishedAt: new Date("2025-08-18T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.13",
    version: "0.2.2.13",
    title: "Command menu and copy hotkeys",
    slug: "0-2-2-13",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added command menu for quick navigation and hotkeys for copying code and prompt variants.

![Command menu](/canvas-changelog/2025-08/command-menu.png)

### What's new:
- Command menu
- Hotkeys for copying code and prompt variant`,
    publishedAt: new Date("2025-08-17T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.12",
    version: "0.2.2.12",
    title: "Help section and help center dialog",
    slug: "0-2-2-12",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added a help section to the right sidebar and introduced help center dialog with useful links.

![Help section](/canvas-changelog/2025-08/help-section.png)

### What's new:
- Help section in the right sidebar
- Help center dialog with links to Slack group and documentation section`,
    publishedAt: new Date("2025-08-16T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.11",
    version: "0.2.2.11",
    title: "Fixed canvas state saving",
    slug: "0-2-2-11",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We fixed the canvas state saving logic to prevent unwanted variant regeneration.

### Fixed:
- Fixed canvas state saving logic so variants won't regenerate when page is reloaded`,
    publishedAt: new Date("2025-08-15T12:00:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.10",
    version: "0.2.2.10",
    title: "Shadcn theme export and video tutorial",
    slug: "0-2-2-10",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We introduced shadcn theme export functionality, added auto-discard for design mode changes, and created a video tutorial.

### What's new:
- Added auto discard unsaved changes when exiting design mode
- Added shadcn theme export button  
- Added [video tutorial](https://screen.studio/share/ArFe80z3)

### Fixed:
- Fixed zoom when zooming interactive shapes - was zooming everything instead of just content
- Fixed page loading speed when adding Screens and improved stability of adding Screens and Components to canvas`,
    publishedAt: new Date("2025-08-14T18:30:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.9",
    version: "0.2.2.9",
    title: "Design mode and style panel",
    slug: "0-2-2-9",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We released Design mode with a comprehensive style panel for visual editing of components.`,
    publishedAt: new Date("2025-08-13T16:30:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.7",
    version: "0.2.2.7",
    title: "Custom themes and shape context menu",
    slug: "0-2-2-7",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We published support for custom themes with visual editor and added context menu for shapes with quick actions.

### What's new:
- Added support for custom themes with visual editor, creating themes from URLs and importing CSS files
- Each theme change creates a new version which allows quick rollback to previous changes if needed
- Added context menu for shapes that can be selected with two keys and quick actions like copy code, open in new tab, copy, delete and so on

![Design mode](/canvas-changelog/2025-08/design-mode.png)

### Fixed:
- Fixed stop button in chat`,
    publishedAt: new Date("2025-08-11T15:45:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.8",
    version: "0.2.2.8",
    title: "Onboarding and version history",
    slug: "0-2-2-8",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We rolled out Canvas onboarding and version history system to help new users get started and manage project versions more effectively.

### What's new:
- Added onboarding to Canvas
- Added version history - dialog for viewing version history and quick rollback to old versions with ability to jump between them without losing progress`,
    publishedAt: new Date("2025-08-12T14:15:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.6",
    version: "0.2.2.6",
    title: "Themes page and community themes",
    slug: "0-2-2-6",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added a themes page where you can browse community themes and preview all available presets with quick theme application.`,
    publishedAt: new Date("2025-08-09T16:20:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.5",
    version: "0.2.2.5",
    title: "5 variants generation, image upload and code preview themes",
    slug: "0-2-2-5",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added referral program, increased generation variants to 5, and made several UI improvements including better code preview styling and shape list highlighting.

### What's new:
- Added referral program (not only for Canvas)
- Added ability to attach images when creating new file (new Canvas)  
- Changed so you can create up to 5 variants in first generation (previously was up to 3)
- Added hotkey for opening/closing sidebar 
- Added styles to make code look nice (code preview variants - in dark theme [Vesper theme by rauno](https://github.com/raunofreiberg/vesper) and in light theme Cursor theme)
- Started showing in shape list which shape is highlighted and number, when shape is highlighted, you can see it highlighted in sidebar list

### Fixed:
- Fixed so code preview auto-resizes with camera zoom 
- Fixed AI logic for project name generation so it doesn't add quotes and doesn't write everything with capital letters
- Removed autofocus from variant input text as it was breaking other inputs`,
    publishedAt: new Date("2025-08-08T14:30:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.4",
    version: "0.2.2.4",
    title: "Chat context system and version restore",
    slug: "0-2-2-4",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We improved variant previews to HTML, created powerful chat context system, and significantly reworked component search experience.

### What's new:
- Improved variant previews to be HTML instead of images
- Created powerful context mechanism that allows adding other variants, components, screens and images to chat context
- Added ability to restore to previous version (restore checkpoint button inside chat for messages)
- Significantly reworked experience of adding and searching components and screens - search and preview styles became faster and more convenient`,
    publishedAt: new Date("2025-08-07T16:45:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.3",
    version: "0.2.2.3",
    title: "Hotkey hints and landing page update",
    slug: "0-2-2-3",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added hotkey hints, updated our landing page with new positioning about bringing taste to interfaces, and fixed message queue issues.

### What's new:
- Added hotkey hints to sidebar
- Auto-focus on variant when entering page to immediately open chat and when creating new file so it doesn't seem like nothing is happening
- Updated landing page with new style and positioning - "We help bring taste to your interfaces, not create generic LLM purple websites"

### Fixed:
- Fixed message queue processing issues`,
    publishedAt: new Date("2025-08-06T15:30:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.2",
    version: "0.2.2.2",
    title: "Message editing and project management",
    slug: "0-2-2-2",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We introduced craft UI for message editing and added project management capabilities including deletion and sharing.

### What's new:
- Craft UI for message editing
- Added ability to delete projects
- Added ability to share projects in Magic Chat`,
    publishedAt: new Date("2025-08-05T14:20:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
  {
    id: "canvas-0.2.2.1",
    version: "0.2.2.1",
    title: "AI project names generation",
    slug: "0-2-2-1",
    isCanvasUpdate: true,
    source: "canvas",
    content: `We added AI generation for project names and fixed bookmark navigation from the main site header.

### What's new:
- AI generation of project names

### Fixed:
- Fixed bookmarks (navigation from 21st header wasn't working)`,
    publishedAt: new Date("2025-08-04T13:15:00Z"),
    htmlUrl: "#",
    isPrerelease: false,
    author: {
      username: "21st.dev Team",
      avatarUrl: "https://avatars.githubusercontent.com/u/55061526?v=4",
      profileUrl: "https://21st.dev",
    },
    downloadCount: 0,
  },
]
