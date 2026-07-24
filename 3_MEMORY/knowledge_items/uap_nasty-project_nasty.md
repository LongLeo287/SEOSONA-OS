# KI: nasty-project/nasty

## Overview
NASty is a NAS operating system built on NixOS and bcachefs. It turns commodity hardware into a storage appliance serving NFS, SMB, iSCSI, and NVMe-oF — managed from a single web UI, updated atomically, and rolled back when things go sideways.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 123 files across 26 directories
- **File types:** .rs: 77, .toml: 12, .json: 12, .md: 11, .yml: 7, .lock: 2, .gitignore: 1

## Core Capabilities
### Storage
- **bcachefs** — compression, checksumming, erasure coding, tiering, encryption, O(1) snapshots
- **File sharing** — NFS and SMB with per-share ACLs
- **Block storage** — iSCSI and NVMe-oF with dedicated targets per volume
- **Subvolumes** — filesystem and block subvolumes with quotas, compression, and tiering per subvolume
- **Snapshots** — instant, space-efficient point-in-time copies
- **Encryption lifecycle** — lock and unlock encrypted filesystems from the WebUI, with a dependents preview that lists every app, VM, share, and backup that would break before you confirm. Optional **TPM2-sealed keys** auto-unlock on boot when the measured-boot state matches
- **File browser** — browse, upload, edit, rename, copy, move, and bulk-manage files from the web UI
- **Backups** — encrypted, deduplicated, incremental backups to local, S3, SFTP, REST, or Backblaze B2 with per-profile schedules and retention

### Monitoring & Alerts
- **Dashboard** — CPU, memory, storage, temperature, frequency — with scrollable history charts (30-day retention)
- **Alerts** — configurable rules for filesystem usage, disk health, temperatures, scrub errors, and more
- **Notifications** — alert delivery via SMTP email, Telegram, webhooks, and ntfy push notifications
- **S.M.A.R.T.** — disk health monitoring with per-disk details
- **[nasty-top](https://github.com/nasty-project/nasty-top)** — standalone TUI for live per-device IO, latency, and tuning

### Apps & VMs
- **Apps** — Docker containers and Compose stacks with image pull progress, container inspect, live per-app resource usage (CPU %, memory, network and disk I/O), and an `allow_unsafe` escape hatch for stacks that need privileged options
- **Virtual machines** — QEMU/KVM with VNC console, disk snapshots, USB passthrough (editable on existing VMs), bridge selection, and an inline disk-import wizard for qcow2 / raw / vmdk images
- **Hardware passthrough** — IOMMU group view, USB device inventory, and vfio-pci toggles that s

## Documentation Sections
- Star History
- Features
- Storage
- Monitoring & Alerts
- Apps & VMs
- System
- Kubernetes
- Community
- Screenshots
- Getting Started
- Update Flavors
- Architecture
- Project Structure
- FAQ
- Telemetry
- License

## Core Structure
```
  .gitignore
  CHANGELOG.md
  CONTRIBUTING.md
  FAQ.md
  INSTALL.md
  LICENSE
  README.md
  THIRD-PARTY-LICENSES.md
  UPDATE.md
  flake.lock
  flake.nix
  nasty-0.0.11-reddit.md
  rust-toolchain.toml
  .github/
    FUNDING.yml
    workflows/
      build-iso.yml
      ci.yml
      integration.yml
      nix-engine-build.yml
      nixpkgs-bump.yml
      security.yml
  docs/
    network-architecture.md
    version-upgrade-system.md
    adr/
      0001-secure-boot-via-lanzaboote.md
  engine/
    Cargo.lock
    Cargo.toml
    deny.toml
    nasty-apps/
      Cargo.toml
      src/
        caddy.rs
        lib.rs
    nasty-backup/
      Cargo.toml
      src/
        jobs.rs
        lib.rs
        scheduler.rs
    nasty-common/
      Cargo.toml
      src/
        cmd.rs
        jsonrpc.rs
        lib.rs
        metrics_types.rs
        secrets.rs
        secure_boot.rs
        state.rs
        tpm.rs
    nasty-engine/
      Cargo.toml
      build.rs
      src/
        app_deploy.rs
        auth.rs
        auth_oidc.rs
        auth_webauthn.rs
        boot_status.rs
        fs_dependents.rs
        fs_lock.rs
        guestshare.rs
        ingress_conflict.rs
        log_stream.rs
        main.rs
        rest_gateway.rs
        subvolume_dependents.rs
        swagger_ui.rs
        telemetry.rs
        terminal.rs
        vm_console.rs
        vm_disk_import.rs
        registry/
          markdown.rs
          methods.rs
          mod.rs
          openapi.rs
          paths.rs
          tests.rs
        router/
          alerts.rs
          apps.rs
          audit.rs
          auth.rs
          backup.rs
          bcachefs.rs
          fs.rs
          guestshare.rs
          mod.rs
          notifications.rs
          service.rs
          share.rs
          smb.rs
          snapshot.rs
          subvolume.rs
          system.rs
          vm.rs
    nasty-metrics/
      Cargo.toml
      fixtures/
        ata_hgst_he10.json
        ata_kioxia_ssd.json
        ata_megaraid_sat.json
        nvme_goodram_irdm.json
        nvme_hynix_bc901.json
        nvme_kingston_snv3s.json
        nvme_samsung_980.json
        nvme_samsung_980_pro.json
        sas_seagate_clean.json
        sas_seagate_failing.json
        sas_toshiba_mg08_padded.json
        scan_open_megaraid.json
      src/
        collect_bcachefs.rs
        collect_kernel.rs
        collect_system.rs
        db.rs
        main.rs
        prometheus.rs
    nasty-sharing/
      Cargo.toml
      src/
        iscsi.rs
  
```

## Quick Start
```bash
engine/         Rust workspace — storage, sharing, system management
webui/          SvelteKit web interface
nixos/          NixOS modules and ISO configuration
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to NASty

## Logging rule

**Every operation must log enough that a failure can be diagnosed from the journal alone — without shipping a "ship visibility patch then ask the user to retry" round-trip.**

This rule exists because we've burned multi-PR cycles on bugs that were *visible all along* but our code threw the diagnostic away. Discussion #159 took four PRs (#197 → #198 → #199 → #200) to land because the engine was swallowing per-connection NetworkManager errors, then per-field DBus type-mismatch errors. Each "ship more logs and ask the reporter to re-run" trip cost a day of latency.

### How to comply

#### Subprocess invocations — use `nasty_common::cmd`

Always route subprocess calls through one of:

- `cmd::run(program, &[args])`           — returns `Output`, callers can react to status. Logs spawn failure + non-zero exit at `warn!`.
- `cmd::run_ok(program, &[args])`        — returns `Ok(stdout)` or `Err(stderr-with-context)`. Same logging.
- `cmd::try_run(program, &[args])`       — best-effort; discards the result but **still logs** spawn failure + non-zero exit at `warn!`. Use for "try to clean up, OK if it doesn't work".

Do **not** call `tokio::process::Command::new(...).output()` / `.status()` directly unless you have a specific reason (long-lived child where you stream stdout, custom env handling, etc.) AND you've thought through the error paths. If you must, the patterns to avoid:

```rust
// ❌ SILENT — exit code and stderr discarded.
let _ = tokio::process::Command::new("systemctl").args([...]).output().await;

// ❌ SILENT on Err — spawn failure lost, only success path is handled.
if let Ok(out) = tokio::process::Command::new("systemctl").args([...]).output().await {
    /* ... */
}

// ✅ LOGGED — spawn failure and non-zero exit always go to the journal.
nasty_common::cmd::try_run("systemctl", &["restart", "foo"]).await;
```

#### Spawned tasks — log errors before they vanish

A `tokio::spawn` block that produces a `Result` and discar


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
