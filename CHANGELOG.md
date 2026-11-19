# Changelog

This is the overview changelog of the GabeTeX umbrella repository. Each app keeps its own detailed changelog and
release notes:

| Platform | Changelog | Releases |
|---|---|---|
| macOS | [GabeTeX-macOS/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-macOS/blob/main/CHANGELOG.md) | [Releases](https://github.com/gabe-rbo/GabeTeX-macOS/releases) |
| Linux & Windows | [GabeTeX-Linux-Windows/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-Linux-Windows/blob/main/CHANGELOG.md) | [Releases](https://github.com/gabe-rbo/GabeTeX-Linux-Windows/releases) |

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- The repository is now an umbrella with two Git submodules, one per edition: `GabeTeX-macOS` (native Swift app) and
  `GabeTeX-Linux-Windows` (a single Tauri 2 codebase for Linux and Windows). Application code, builds, releases and
  platform-specific issues live in those repositories.
- The website (`docs/`) stays here; its download and release links point to GabeTeX-macOS.

## Overview of releases

- **v1.1.1** (2026-11-19): cross-platform release with Tectonic WASM fallback compiler, Zotero local API BibTeX
  integration, appearance/theme/accent & Brazilian Portuguese (`pt-BR`) localization, configurable auto-save and
  multi-language spell checking, VoiceOver/screen reader improvements, integrated Windows TinyTeX installer, and Ubuntu
  22.04 (`glibc 2.35`) Linux packaging fixes. See [GabeTeX-macOS/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-macOS/blob/main/CHANGELOG.md) and [GabeTeX-Linux-Windows/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-Linux-Windows/blob/main/CHANGELOG.md).
- **macOS 1.0.0** (2026-10-29): first public release of GabeTeX for macOS. See the
  [macOS changelog](https://github.com/gabe-rbo/GabeTeX-macOS/blob/main/CHANGELOG.md).
