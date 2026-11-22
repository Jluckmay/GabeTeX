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

- **v1.1.2** (2026-11-21): cross-platform release introducing the categorized **Math Symbols** sidebar panel (`Σ`, 15 categories / 470 symbols including **Linguistic Symbols** with PDF-style curly serif quotes and `\log_{}` base subscript) with click-to-insert, drag-and-drop, automatic `\usepackage{...}` preamble imports (including `main.tex` fallback), and context-aware `$...$` / `\[...\]` wrapping across macOS, Linux/Windows, and the Online Editor (`docs/`); extended delimiter auto-pairing and paired deletion (`{ }`, `( )`, `[ ]`, `$ $`, `\( \)`, `\[ \]`, `\begin{env}...\end{env}`); **Book**, **Report**, and **Poster** project templates (9 templates total); updated website showcases and crimson-palette screenshots; plus security and stability hardening (strict package-name validation, template symlink checks, atomic undo for preamble imports, balanced `$$`/command-argument/`\left...\right)` deletion guards, and Swift 6.2 fixes). See [GabeTeX-macOS/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-macOS/blob/main/CHANGELOG.md) and [GabeTeX-Linux-Windows/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-Linux-Windows/blob/main/CHANGELOG.md).
- **v1.1.1** (2026-11-19): cross-platform release featuring the redesigned Liquid Glass Online Editor (`docs/`),
  Tectonic WASM fallback compiler with SHA-256 verification across all editions, Zotero 7 local API (`127.0.0.1:23119`)
  BibTeX integration, appearance/theme/accent & Brazilian Portuguese (`pt-BR`) localization, configurable auto-save and
  multi-language spell checking, VoiceOver/screen reader improvements, hardened Tauri CSP & IPC path/symlink security,
  Windows path-separator normalization, integrated Windows TinyTeX installer, and Ubuntu 22.04 (`glibc 2.35`) Linux
  packaging fixes. See [GabeTeX-macOS/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-macOS/blob/main/CHANGELOG.md) and [GabeTeX-Linux-Windows/CHANGELOG.md](https://github.com/gabe-rbo/GabeTeX-Linux-Windows/blob/main/CHANGELOG.md).
- **macOS 1.0.0** (2026-10-29): first public release of GabeTeX for macOS. See the
  [macOS changelog](https://github.com/gabe-rbo/GabeTeX-macOS/blob/main/CHANGELOG.md).
