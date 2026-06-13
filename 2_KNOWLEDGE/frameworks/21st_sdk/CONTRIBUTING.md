# Contributing to AN SDK

Thanks for your interest in contributing to AN SDK!

## Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/21st-dev/an-sdk/issues/new) with:

- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Which package is affected (`@an-sdk/agent`, `@an-sdk/react`, etc.)

## Pull Requests

We welcome PRs for bug fixes, documentation improvements, and new features.

1. Fork the repo and create your branch from `main`
2. Install dependencies: `pnpm install`
3. Make your changes
4. Run the build to verify: `pnpm build`
5. Open a PR with a clear description

### Development Setup

```bash
git clone https://github.com/21st-dev/an-sdk.git
cd an-sdk
pnpm install
pnpm build
```

### Code Style

- TypeScript throughout
- Follow existing patterns in the codebase
- Keep changes focused — one feature or fix per PR

## How This Repo Works

This repo contains the open-source SDK packages for the AN platform. The source of truth is maintained internally, and this repo is synced periodically. We review and merge community PRs, then sync them back.

## Questions?

Join the discussion in [GitHub Issues](https://github.com/21st-dev/an-sdk/issues) or reach out at [an.dev](https://an.dev).
