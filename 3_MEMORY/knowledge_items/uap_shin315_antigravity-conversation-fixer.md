# KI: shin315/antigravity-conversation-fixer

## Overview
This project, "Antigravity Conversation Fixer," appears to be a tool designed to repair or modify conversation data associated with the Antigravity application.  It provides both a graphical user interface (GUI) and a terminal user interface (TUI) for interacting with this process. The core functionality involves scanning conversations, fixing them based on defined rules, and managing related database operations.

## Tech Stack (from code)
- **Language:** Python 3 (evident from the `.py` file extensions and `if __name__ == "__main__":` blocks in `gui_main.py` and `tui_main.py`).
- **GUI Framework:** CustomTkinter (imported in `gui_main.py`: `from src.gui.app import AntigravityFixerApp`)
- **TUI Framework:** Rich (listed as a dependency in `requirements.txt`: `rich>=13.0.0`)
- **Database:** SQLite3 (`sqlite3` module imported and used in `src/core/database.py`).
- **Build System:**  The project uses batch files (`start_gui.bat`, `build_exe.bat`, `start_tui.bat`) suggesting a Windows build environment, although the code itself is platform agnostic to some degree.

## Public API / Exports
Due to the nature of this being a tool rather than a library, there are no explicitly exported functions or classes intended for external use. However, based on the structure and comments in `src/core/fixer.py`, the following functions appear to be core components:

- `scan()`:  Scans conversations on disk (read-only).
- `fix(conversations, workspace_assignments)`: Fixes conversations and writes data to a database.
- `Callbacks`: A dataclass used for progress reporting callbacks.

## Dependencies
Based on the contents of `requirements.txt`, the project depends on:

- `customtkinter>=5.2.0`
- `rich>=13.0.0`

## Architecture Patterns
- **Layered Architecture:** The code is structured into distinct layers (`src/core`, `src/gui`, `src/tui`, `src/i18n`) with clear separation of concerns.  The core logic resides in the `src/core` directory, while GUI and TUI implementations are separate modules.
- **Callback Pattern:** The `Callbacks` dataclass and associated `_emit` function demonstrate the use of callbacks for progress reporting and error handling. This allows different parts of the application to communicate status updates without direct dependencies.
- **Configuration via Constants:**  Paths to important directories (database, conversations, brain) are defined as constants in `src/core/paths.py`, making them easily configurable based on the operating system.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Data Repair Utilities:** The core "fixer" logic and database interaction patterns could be adapted to create general-purpose data repair utilities for various file formats or data stores used within the SEOSONA ecosystem.
- **Cross-Platform Abstraction:**  The `paths.py` module provides a good example of how to abstract OS-specific paths, which is crucial for cross-platform compatibility in SEOSONA. This pattern could be reused in other projects.
- **GUI/TUI Framework Integration:** The project demonstrates the integration of CustomTkinter and Rich, providing valuable insights into building user interfaces for SEOSONA applications targeting different platforms (desktop vs. terminal).  The callback mechanism used for progress reporting is also a useful pattern to adopt.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
