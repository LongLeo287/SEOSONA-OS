# AgentPet Telemetry Architecture

**Source:** Cloned repository `ntd4996/agentpet` (macOS Native SwiftUI App)
**Assimilated Date:** Live Ingestion via UAP.

## 1. Core Value (Unique Proposition)
AgentPet solves the "tab-hunting" problem in multi-agent environments. When orchestrating multiple autonomous AI coding agents (e.g., using Fan-Out or Tournament patterns), monitoring their status becomes a cognitive burden. AgentPet provides an **Ambient UX** (a menu bar icon and a desktop pet) that aggregates agent states.

## 2. Architectural Design Patterns
The system tracks agent states (`working`, `done`, `waiting for input`, `idle`) using a non-intrusive architecture:

### A. The Unix-Socket Daemon (Event Receiver)
Instead of polling the terminal or reading log files continuously, AgentPet runs a lightweight daemon listening on a Unix domain socket.
Agents or wrapper scripts push state changes to this socket asynchronously. This is highly efficient and decouples the UI from the execution environment.

### B. CLI Wrapper / Shell Hooks (Event Emitters)
- **Direct Hooks**: Modifying the configuration of agents like Claude Code to emit signals to the Unix socket when they start, stop, or pause for human input.
- **Universal Wrapper**: A CLI tool (`agentpet run -- <command>`) that wraps any standard CLI agent. It intercepts the start and exit signals of the child process to automatically report `working` and `done` states to the daemon.

### C. Ambient UX (The Pet)
Using a visual desktop pet (based on the Codex pet-pack format) to reflect aggregate states. This transforms technical telemetry into a peripheral, low-stress signal. 

## 3. Compatibility & Constraints
- **Platform**: Written in Swift/SwiftUI, strictly for macOS 13+. It uses Apple-specific APIs for UI rendering and notifications.
- **Windows Limitation**: Cannot be executed natively on Windows.

## 4. System Upgrade (SEOSONA Integration)
For the SEOSONA System (which runs on Windows):
- **Telemetry Pattern**: Future Windows-based sub-agents within SEOSONA should adopt the **Asynchronous Socket/Port Telemetry Pattern** to report their status to the Orchestrator, rather than relying solely on standard output parsing.
- **Ambient Feedback**: The concept of reducing cognitive load through ambient signals is added to UI/UX engineering principles.

