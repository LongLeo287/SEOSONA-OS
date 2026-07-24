# KI: lewislulu/html-ppt-skill

## Overview
This project appears to be a tool for creating interactive presentations using HTML, CSS, and JavaScript. The repository contains numerous pre-built themes, animations, and layout templates designed to enhance presentation aesthetics and engagement.  The presence of scripts like `new-deck.sh` suggests it's intended for generating new presentation decks from provided templates.

## Tech Stack (from code)
- **HTML:** Extensive use throughout the project, particularly in files within the `assets/` directory and under `docs/readme/`. Example: `assets/animations/fx/_util.js` contains HTML string manipulation.
- **CSS:**  Used for styling and theming, with a large number of CSS files located in `assets/themes/`. Example: `assets/base.css` defines base styles.
- **JavaScript:** Used for animations and interactivity. Example: `assets/runtime.js` is referenced by multiple HTML files.
- **Bash Scripting:**  Scripts like `new-deck.sh` and `render.sh` are used for automation tasks. Example: `scripts/new-deck.sh` demonstrates bash scripting for deck creation.

## Public API / Exports
Due to the nature of this project (likely a collection of assets rather than a library), there isn't a clear "public API" in the traditional sense. However, several JavaScript files appear to be designed as modular components:

- `assets/animations/fx/_util.js`:  This file contains functions likely used by other animation scripts within the `assets/animations/fx/` directory. While not explicitly exported using a module system (like ES modules), its usage in other files suggests it's intended to be shared.
- `assets/runtime.js`: This appears to be a core script that handles presentation logic and is included in many HTML templates, implying it provides functionality accessible from those templates.

## Dependencies
The project does not contain a `package.json` file or any other dependency management file (e.g., `requirements.txt`, `Cargo.toml`). Therefore, the dependencies are unknown without further investigation of the code itself.

## Architecture Patterns
- **Theme-based Design:** The extensive collection of CSS files within the `assets/themes/` directory indicates a theme-based architecture where presentation appearance can be easily changed by swapping out CSS files. Example: `assets/themes/aurora.css`.
- **Component-Based Animation:** Animations are organized into separate JavaScript files (e.g., `assets/animations/fx/chain-react.js`), suggesting a component-based approach to animation design, where each file represents a reusable animation module.
- **Templating:** The presence of scripts like `new-deck.sh` and the structure of HTML files suggest a templating system is in use, allowing for automated generation of presentation decks from predefined templates.

## Relevance to SEOSONA OS
The project's focus on interactive presentations and visual effects could be beneficial to SEOSONA OS in several ways:

- **Presentation Tool Integration:** The themes and animations could be integrated into a SEOSONA OS native presentation tool, providing users with enhanced design options.
- **Visual Effects Library:**  The animation scripts (e.g., `assets/animations/fx/*.js`) could serve as a library of reusable visual effects for other applications within the OS.
- **Templating Engine Inspiration:** The templating approach used in this project could inspire improvements to SEOSONA OS's own document creation and presentation workflows, allowing users to easily generate customized content from templates.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 0}
