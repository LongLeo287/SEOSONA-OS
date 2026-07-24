# KI: Yeachan-Heo/oh-my-codex

## Overview
Repository with 831 files across 195 directories. Primary language: TypeScript (342 files).

## Tech Stack (from code)
- TypeScript (342 files)
- Rust (33 files)
- Python (13 files)
- Shell (5 files)
- **Total:** 831 files, 195 directories
- **File types:** .md: 390, .ts: 342, .rs: 33, .json: 20, .py: 13, .toml: 8, .gitignore: 5, .html: 5

## Public API / Exports
- `setup` from `src/index.ts`
- `doctor` from `src/index.ts`
- `version` from `src/index.ts`
- `mergeConfig` from `src/index.ts`
- `AGENT_DEFINITIONS` from `src/index.ts`
- `type AgentDefinition` from `src/index.ts`
- `generateAgentToml` from `src/index.ts`
- `installNativeAgentConfigs` from `src/index.ts`
- `hudCommand` from `src/index.ts`
- `AgentDefinition` from `src\agents\definitions.ts`
- `AGENT_DEFINITIONS` from `src\agents\definitions.ts`
- `EXACT_GPT_5_4_MINI_MODEL` from `src\agents\native-config.ts`
- `EXACT_RESEARCHER_MODEL` from `src\agents\native-config.ts`
- `NON_NATIVE_AGENT_PROMPT_ASSETS` from `src\agents\policy.ts`
- `isNativeAgentInstallableStatus` from `src\agents\policy.ts`
- `getCatalogAgentStatusByName` from `src\agents\policy.ts`
- `getCatalogAgentByName` from `src\agents\policy.ts`
- `getInstallableNativeAgentNames` from `src\agents\policy.ts`
- `getNonInstallableNativeAgentNames` from `src\agents\policy.ts`
- `isSetupPromptAssetName` from `src\agents\policy.ts`
- `assertNativeAgentCanonicalTargets` from `src\agents\policy.ts`
- `setup` from `src\index.ts`
- `doctor` from `src\index.ts`
- `version` from `src\index.ts`
- `mergeConfig` from `src\index.ts`
- `AGENT_DEFINITIONS` from `src\index.ts`
- `type AgentDefinition` from `src\index.ts`
- `generateAgentToml` from `src\index.ts`
- `installNativeAgentConfigs` from `src\index.ts`
- `hudCommand` from `src\index.ts`

## Imports Detected in Source
- `fs`
- `path`

## File Structure
```
  .gitignore
  CHANGELOG.md
  CONTRIBUTING.md
  COVERAGE.md
  Cargo.lock
  Cargo.toml
  DEMO.md
  README.md
  RELEASE_BODY.md
  RELEASE_PROTOCOL.md
  biome.json
  dist-workspace.toml
  package-lock.json
  package.json
  tsconfig.json
  tsconfig.no-unused.json
  .agents/
    plugins/
      marketplace.json
  .gjc/
    plans/
      hud-state-session-reconciliation.md
    ultragoal/
      brief.md
      goals.json
      ledger.jsonl
      quality-gate-g001-gjc.json
      quality-gate-g001.json
  crates/
    omx-api/
      Cargo.toml
      src/
        lib.rs
        main.rs
    omx-explore/
      Cargo.toml
      src/
        main.rs
    omx-mux/
      Cargo.toml
      src/
        lib.rs
        tmux.rs
        types.rs
    omx-runtime/
      Cargo.toml
      src/
        main.rs
    omx-runtime-core/
      Cargo.toml
      src/
        authority.rs
        dispatch.rs
        engine.rs
        lib.rs
        mailbox.rs
        replay.rs
    omx-sparkshell/
      Cargo.lock
      Cargo.toml
      src/
        codex_bridge.rs
        error.rs
        exec.rs
        main.rs
        prompt.rs
        redaction.rs
        test_support.rs
        threshold.rs
        registry/
          c_cpp.rs
          csharp.rs
          generic_shell.rs
          git.rs
          go.rs
          java_kotlin.rs
          mod.rs
          node_js.rs
          python.rs
          ruby.rs
          rust.rs
          swift.rs
  docs/
    STATE_MODEL.md
    _config.yml
    adapt.md
    agents.html
    autoresearch-goal.md
    clawhip-event-contract.md
    codex-native-hooks.md
    discord-integration.md
    geobench.md
    getting-started.html
    guidance-schema.md
    hermes-mcp-bridge.md
    hooks-extension.md
    index.html
    integrations.html
    interop-team-mutation-contract.md
    migration-mainline-post-v0.4.4.md
    openclaw-integration.de.md
    openclaw-integration.es.md
    openclaw-integration.fr.md
    openclaw-integration.it.md
    openclaw-integration.ja.md
    openclaw-
```

## Key Source Excerpts
### src/index.ts
```typescript
/**
 * oh-my-codex - Multi-agent orchestration for OpenAI Codex CLI
 *
 * This package provides:
 * - 30+ specialized agent prompts as Codex CLI slash commands
 * - 35+ workflow skills as SKILL.md files
 * - AGENTS.md orchestration brain
 * - MCP servers for state management, project memory, and notepad
 * - CLI tool (omx) for setup, diagnostics, and management
 * - Notification hooks for workflow tracking
 */

export { setup } from './cli/setup.js';
export { doctor } from './cli/doctor.js';
export { version } from './cli/version.js';
export { mergeConfig } from './config/generator.js';
export { AGENT_DEFINITIONS, type AgentDefinition } from './agents/definitions.js';
export { generateAgentToml, installNativeAgentConfigs } from './agents/native-config.js';
export { hudCommand } from './hud/index.js';

```

### crates\omx-api\src\lib.rs
```rust
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::env;
use std::fs;
use std::io::{self, BufRead, BufReader, Read, Write};
use std::net::{IpAddr, Shutdown, TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

pub type Result<T> = std::result::Result<T, OmxApiError>;

pub const DEFAULT_API_PORT: u16 = 14510;
pub const MAX_HTTP_HEADER_BYTES: usize = 64 * 1024;
pub const MAX_HTTP_BODY_BYTES: usize = 4 * 1024 * 1024;
const CODEX_RESPONSES_PATH: &str = "/responses";
const CODEX_IMAGES_GENERATIONS_PATH: &str = "/images/generations";
const CODEX_DEFAULT_ORIGINATOR: &str = "codex_cli_rs";
const CODEX_DEFAULT_BACKEND_BASE_PATH: &str = "/backend-api/codex";
const CODEX_INSTALLATION_ID_HEADER: &str = "x-codex-installation-id";
const CODEX_WINDOW_ID_HEADER: &str = "x-codex-window-id";

#[derive(Debug)]
pub enum OmxApiError {
    Io(io::Error),
    Json(serde_json::Error),
    Message(String),
}

impl std::fmt::Display for OmxApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(error) => write!(f, "{error}"),
            Self::Json(error) => write!(f, "{error}"),
            Self::Message(message) => f.write_str(message),
        }
    }
}

impl std::error::Error for OmxApiError {}

impl 
```

### crates\omx-mux\src\lib.rs
```rust
mod tmux;
mod types;

pub use tmux::{build_capture_pane_args, TmuxAdapter};
pub use types::*;

pub fn canonical_contract_summary() -> String {
    format!(
        "mux-operations={operations}\nmux-target-kinds={target_kinds}\nsubmit-policy={submit_policy}\nreadiness={readiness}\nconfirmation={confirmation}\nadapter=tmux",
        operations = MUX_OPERATION_NAMES.join(", "),
        target_kinds = MUX_TARGET_KINDS.join(", "),
        submit_policy = SubmitPolicy::enter(2, 100),
        readiness = PaneReadinessReason::Ok,
        confirmation = DeliveryConfirmation::Confirmed,
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn canonical_contract_names_remain_generic() {
        assert_eq!(
            MUX_OPERATION_NAMES,
            &[
                "resolve-target",
                "send-input",
                "capture-tail",
                "inspect-liveness",
                "attach",
                "detach",
            ]
        );
        assert_eq!(MUX_TARGET_KINDS, &["delivery-handle", "detached"]);
    }

    #[test]
    fn input_envelope_normalizes_literal_text_for_typed_send() {
        let envelope = InputEnvelope::new("hello\nbridge", SubmitPolicy::enter(2, 100));
        assert_eq!(envelope.normalized_text(), "hello bridge");
        assert_eq!(envelope.submit.presses(), 2);
        assert_eq!(
            format!("{}", envelope.submit),
            "enter(presses=2, delay_ms=100)"
        );
    }

    #[test]
    fn confirmation_polic
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
