# KI: spike0en/nothing_archive

## Overview
If this project helps you, please consider [starring the repository](https://github.com/spike0en/nothing_archive/stargazers). It helps with discoverability and encourages maintenance. Thank you!

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 128 files across 16 directories
- **File types:** .md: 80, .so: 21, .json: 11, .jpg: 5, .yml: 3, .sh: 2, .ts: 2

## Documentation Sections
- Support the Project
- Overview
- Contents
- Contributing
- Licensing
- Acknowledgements

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  LICENSE
  LICENSE-CC-BY-NC-4.0
  LICENSE-MIT
  README.md
  .github/
    workflows/
      deploy.yml
      dump.yml
      link-checker.yml
  assets/
    sideloading/
      1.1_ota_sideload.jpg
      1.2_ota_sideload.jpg
      2.1_ota_sideload.jpg
      2.2_ota_sideload.jpg
      3.1_ota_sideload.jpg
  bin/
    README.md
    libbase.so
    libbrillo-stream.so
    libbrillo.so
    libc++.so
    libchrome.so
    libcrypto-host.so
    libcrypto_utils.so
    libcutils.so
    libevent-host.so
    libext4_utils.so
    libfec.so
    liblog.so
    liblz4.so
    libpcre2.so
    libprocessgroup.so
    libprotobuf-cpp-lite.so
    libselinux.so
    libsquashfs_utils.so
    libssl-host.so
    libz-host.so
    libziparchive.so
    ota_extractor
  scripts/
    devices.json
    dump.sh
    extract.bat
    extract.sh
  website/
    docusaurus.config.ts
    package-lock.json
    package.json
    sidebars.ts
    tsconfig.json
    docs/
      acknowledgements.md
      apps.md
      contributing.md
      devices.md
      firmware.md
      guides.md
      intro.md
      licensing.md
      mentions.md
      official.md
      photography.md
      projects.md
      changelogs/
        _category_.json
        index.md
        asteroids/
          Asteroids-B4.0-251118-1551.md
          Asteroids-B4.0-251229-2335.md
          Asteroids-B4.0-260225-1824.md
          Asteroids-B4.1-260414-1749.md
          Asteroids-V3.1-250217-2235.md
          Asteroids-V3.1-250302-1856.md
          Asteroids-V3.1-250320-2319.md
          Asteroids-V3.1-250401-1916.md
          Asteroids-V3.1-250417-1222.md
          Asteroids-V3.1-250529-1004.md
          Asteroids-V3.1-250610-1841.md
          Asteroids-V3.2-250717-1803.md
          Asteroids-V3.2-250924-1736.md
          Asteroids-V3.2-251013-1406.md
          _category_.json
        frogger/
          Frogger-B4.1-260204-2218.md
          Frogger-B4.1-260309-1830.md
          Frogger-B4.1-260317-2043.md
          Frogger-B4.1-260402-1229.md
          Frogger-B4.1-260430-1731.md
          _category_.json
        froggerpro/
          FroggerPro-B4.1-260323-1635.md
          FroggerPro-B4.1-260424-1447.md
          FroggerPro-B4.1-260522-1414.md
          _category_.json
        galaga/
          Galaga-B4.0-251218-2326.md
          Galaga-B4.0-260108-1654.md
          Galaga-B4.0-260226-1122.md
          Galaga-B4.1-260415-1710.md
          Galaga-V3.2-250425-1517.md
          Galaga-V3.2-250507-1139.md
          Ga
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to Nothing Archive

First off, thank you for considering contributing to the Nothing Archive project!

## Ways to Contribute

We welcome community participation in two primary areas:

### 1. Documentation Maintenance & Growth
This involves the continuous upkeep and expansion of the main English documentation. Contributions include:
- Adding new entries to `apps.md`, `projects.md`, and `official.md`.
- Updating information in `devices.md`, `photography.md`, and `guides.md`.
- Fixing typos, updating broken links, and improving readability.

### 2. Technical Development & Enhancements
Contribute to the website's infrastructure by resolving bugs or adding features. Technical contributions should:
- Respect existing coding conventions to ensure future scalability and ease of maintenance.
- Prioritize stable, premium user experiences while minimizing unnecessary divergence from the core source.

---

## Restricted Files & Directories

To ensure accuracy and preserve integrity, **do not** submit pull requests that modify the following files or directories:
- `website/docs/firmware.md`
- `website/docs/changelogs/`

These are maintained only by the project authors and collaborators.

---

## Documentation Guidelines

In order to ensure perfect alphabetical sorting, please follow these strict naming and sorting rules when adding new entries to `apps.md` or `projects.md`:

### 1. Naming Convention (Spaces & Title Case)
*   **Spaces for Readability:** Even if the Play Store or GitHub uses CamelCase, always add a space between words.
    *   ❌ `GlyphGlow` $\rightarrow$ ✅ **Glyph Glow**
    *   ❌ `NothingOS` $\rightarrow$ ✅ **Nothing OS**
    *   ❌ `BetterBattery` $\rightarrow$ ✅ **Better Battery**
*   **Title Case:** All entries must be properly capitalized. Avoid all-lowercase or repo-style names.
    *   ❌ `nothing-rice` $\rightarrow$ ✅ **Nothing Rice**
    *   ❌ `n-recipe` $\rightarrow$ ✅ **N Recipe**

### 2. Alphabetical Sorting
*   All entries within a table 


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
