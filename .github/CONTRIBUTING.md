<div align="center">
  <img src="https://raw.githubusercontent.com/LongLeo287/SEOSONA-OS/main/.github/assets/Seosona_Logo.png" alt="SEOSONA OS" width="400">
</div>

*Read this in other languages: [Tiếng Việt](CONTRIBUTING-vi.md).*

---

# Contributing to SEOSONA OS

Thank you for your interest in contributing to SEOSONA OS! We welcome all contributions, including bug reports, feature requests, and code modifications.

## How to Contribute

### 1. Fork the Repository
First, fork the repository to your own GitHub account.

### 2. Create a Feature Branch
Create a new branch for your feature or bugfix:
```bash
git checkout -b feature/your-feature-name
```

### 3. Add a New Skill (If applicable)
If you are contributing a new skill, please ensure it follows the standard framework structure:
```
2_KNOWLEDGE/frameworks/<domain>/<skill-name>/
├── README.md         # Skill overview and usage
├── SKILL.md          # Full skill prompt / SOP
├── _DIR_IDENTITY.md  # Directory identity and scope
├── schema.json       # Structured metadata
└── references/       # Supporting reference files
```

### 4. Commit Your Changes
Make your changes and commit them with descriptive messages.
```bash
git commit -m 'feat: Add new skill pack for X'
```

### 5. Push and Open a Pull Request
Push your branch to your fork and open a Pull Request against the `main` branch of SEOSONA OS.

## Guidelines
- Ensure all AI rules and standard operating procedures are written clearly in Markdown.
- Keep `SOUL.md` modular. If a capability is large, it should be an external `.md` skill in `2_KNOWLEDGE`.
- Test the CLI (`seosona-cli`) locally if you make changes to `cli/src/`.
