# KI: nikaiw/VMkatz

## Overview
VMkatz is a command-line tool designed for memory forensics, specifically focused on extracting credentials from virtual machine snapshots and disk images. It supports various virtualization platforms including VMware, VirtualBox, QEMU, Hyper-V, and can parse different disk image formats like VDI, VMDK, RAW, and more. The project aims to automate the process of retrieving potentially sensitive information from these virtual environments.

## Tech Stack (from code)
- **Language:** Rust (`src/lib.rs`: `pub mod discover;`)
- **Build System:** Cargo (`Cargo.toml`)
- **Dependencies:**  The `Cargo.toml` file lists dependencies including `clap`, `thiserror`, `anyhow`, `memmap2`, and others, indicating a focus on command-line argument parsing, error handling, memory mapping, and data processing.

## Public API / Exports
Based on the `src/lib.rs` file, the following modules are publicly exported:
- `discover`:  For discovering VM files within directories (`src/lib.rs`: `pub mod discover;`)
- `dump`: For dumping process memory in a minidump format (`src/lib.rs`: `#[cfg(feature = "dump")] pub mod dump;`)
- `error`: Defines custom error types for the application (`src/lib.rs`: `pub mod error;`)
- `minidump`: Provides functionality related to parsing and working with minidump files (`src/lib.rs`: `pub mod minidump;`)
- `utils`: Contains utility functions (`src/lib.rs`: `pub mod utils;`)
- `hyperv`:  Specific module for Hyper-V support (`src/lib.rs`: `#[cfg(feature = "hyperv")] pub mod hyperv;`)
- `lsass`: Module related to LSASS credential extraction (`src/lib.rs`: `pub mod lsass;`)
- `memory`: Provides memory access and manipulation functions (`src/lib.rs`: `pub mod memory;`)
- `ntds`:  Module for parsing NTDS structures (`src/lib.rs`: `#[cfg(feature = "ntds.dit")] pub mod ntds;`)
- `sam`: Module for SAM database processing (`src/lib.rs`: `#[cfg(feature = "sam")] pub mod sam;`)
- `vbox`:  Module related to VirtualBox support (`src/lib.rs`: `#[cfg(feature = "vbox")] pub mod vbox;`)
- `vmware`: Module for VMware support (`src/lib.rs`: `#[cfg(feature = "vmware")] pub mod vmware;`)
- `windows`:  Module containing Windows-specific data structures and functions (`src/lib.rs`: `pub mod windows;`)

## Dependencies
The following dependencies are listed in the `Cargo.toml` file:
- `memmap2`: For memory mapping files (optional, used by VMware, VBox, Qemu, Hyperv features).
- `ntfs`:  For NTFS filesystem operations (optional, used by SAM feature).
- `md-5`, `sha2`: For cryptographic hashing (optional, used by SAM feature).
- `aes`, `des`, `cbc`: Cryptographic primitives.
- `clap`: Command-line argument parsing.
- `thiserror`: Error handling.
- `anyhow`:  Error context management.
- `hex`: Hexadecimal encoding/decoding.
- `log`: Logging framework.
- `memchr`: Memory searching.

## Architecture Patterns
- **Feature Flags:** The code heavily utilizes Rust's feature flags (`#[cfg(feature = "vmware")]`) to conditionally compile modules and functionality based on the desired virtualization platform support. This allows for building smaller binaries with only the necessary components.  (`Cargo.toml`: `[features] ... vmware = ["dep:memmap2"]`)
- **Modular Design:** The project is structured into distinct modules (e.g., `lsass`, `vmware`, `disk`), each responsible for a specific aspect of the memory forensics process. This promotes code reusability and maintainability. (`src/lib.rs`)
- **Error Handling with Custom Types:**  The use of `thiserror` and a custom `VmkatzError` enum demonstrates a focus on robust error handling, providing more informative error messages. (`src/error.rs`)

## Relevance to SEOSONA OS
VMkatz's code could benefit SEOSONA OS in the following ways:
- **Virtual Machine Forensics Support:**  SEOSONA OS could integrate VMkatz or its components to provide built-in capabilities for analyzing virtual machine memory dumps, aiding in incident response and malware analysis.
- **Disk Image Parsing Libraries:** The disk image parsing modules (VDI, VMDK, etc.) within VMkatz could be adapted and incorporated into SEOSONA OS's file system utilities or forensic tools.
- **Credential Extraction Techniques:**  The LSASS credential extraction techniques implemented in VMkatz could inform the development of similar capabilities within SEOSONA OS for detecting compromised credentials.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
