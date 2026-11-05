<p align="center">
  <img src="docs/assets/icon.png" width="128" height="128" alt="GabeTeX app icon">
</p>

<h1 align="center">GabeTeX</h1>

<p align="center">
  <b>A LaTeX editor for projects, not just files.</b><br>
  Live compilation while you type, a built-in PDF with precise two-way sync, and an interface that feels native on each platform.
</p>

<p align="center">
  <a href="https://github.com/gabe-rbo/GabeTeX-macOS/releases/latest"><img alt="Latest macOS release" src="https://img.shields.io/github/v/release/gabe-rbo/GabeTeX-macOS?display_name=tag&sort=semver"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue"></a>
  <a href="https://github.com/gabe-rbo/GabeTeX-macOS/actions/workflows/ci.yml"><img alt="macOS CI" src="https://github.com/gabe-rbo/GabeTeX-macOS/actions/workflows/ci.yml/badge.svg"></a>
</p>

<p align="center">
  <a href="https://github.com/gabe-rbo/GabeTeX-macOS/releases/latest/download/GabeTeX.dmg"><img alt="Download GabeTeX for Mac" src="https://img.shields.io/badge/Download%20for%20Mac-GabeTeX.dmg-0A84FF?style=for-the-badge&logo=apple&logoColor=white"></a>
  <a href="https://github.com/gabe-rbo/GabeTeX-Linux-Windows/releases"><img alt="Download GabeTeX for Linux" src="https://img.shields.io/badge/Download%20for%20Linux-.AppImage/.deb-0A84FF?style=for-the-badge&logo=linux&logoColor=white"></a>
  <a href="https://github.com/gabe-rbo/GabeTeX-Linux-Windows/releases"><img alt="Download GabeTeX for Windows" src="https://img.shields.io/badge/Download%20for%20Windows-.exe/.msi-0A84FF?style=for-the-badge&logo=windows&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://gabe-rbo.github.io/GabeTeX/">Website</a> ·
  <a href="https://github.com/gabe-rbo/GabeTeX-macOS/releases">macOS releases</a> ·
  <a href="CHANGELOG.md">Changelog</a> ·
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="README.pt-BR.md">Português (Brasil)</a>
</p>

<p align="center">
  <img src="docs/assets/screenshots/project.png" width="900" alt="A GabeTeX project window: file sidebar, LaTeX editor and the live PDF preview side by side">
</p>

---

> This is the **umbrella repository** of GabeTeX. It holds the website, the community files and two Git submodules, one per
> edition (macOS, and Linux + Windows). The apps themselves, with their build instructions, releases and issues, live in the two platform repositories below.

## Platforms

| Platform | Status | Technology | Repository | Download |
|---|---|---|---|---|
| **macOS** | Available | Swift, SwiftUI and AppKit (macOS 26+, Apple Silicon) | [GabeTeX-macOS](https://github.com/gabe-rbo/GabeTeX-macOS) | [Releases](https://github.com/gabe-rbo/GabeTeX-macOS/releases) · [GabeTeX.dmg](https://github.com/gabe-rbo/GabeTeX-macOS/releases/latest/download/GabeTeX.dmg) |
| **Linux & Windows** | In development (UI implemented, tested on Linux; Windows only built in CI) | Tauri 2 (Rust + TypeScript), one shared codebase | [GabeTeX-Linux-Windows](https://github.com/gabe-rbo/GabeTeX-Linux-Windows) | No release yet. Planned: AppImage, `.deb`, `.exe`, `.msi` |

## Why GabeTeX

GabeTeX was written by a mathematician who keeps every paper as `main.tex` plus one file per section, and wanted an
editor that treats that as the normal case. It has three goals:

1. **Beautiful and native.** On macOS: SwiftUI and AppKit, the Liquid Glass look of macOS 26, Light and Dark mode,
   no web view, no Electron, no third-party dependencies.
2. **Projects, not files.** Open a folder and get a file tree, tabs, Quick Open, a document outline that spans every
   included file, and ⌘-click navigation through `\input`, `\include` and `\ref`.
3. **It adapts to your TeX.** GabeTeX finds the TeX distribution you already have, compiles in the background while
   you type, puts the errors on the right line of the right file, and offers to install missing packages.

## Main features

*Described for the macOS app, which is available today. The Linux and Windows apps are being built towards the same goals.*

- **Projects and navigation:** open any folder or start from a template (Article, Thesis, Beamer, Math Notes, Problem
  Set); file tree, tabs, Quick Open (⌘P) and a cross-file outline; one-file-per-section writing with `% !TEX root`
  and `% !TEX program` magic comments.
- **Live compilation:** detects MacTeX, TeX Live, BasicTeX and TinyTeX, runs `latexmk` (pdfLaTeX, XeLaTeX, LuaLaTeX)
  in the background in a private shadow copy, so your files are never touched until you save; unsaved text is included.
- **Errors where they belong:** TeX log and ChkTeX diagnostics underlined at the right line of the right file, an
  Issues panel, live warnings for missing labels, duplicate labels and missing citations, and one-click installation
  of missing packages through `tlmgr`.
- **PDF preview with two-way sync:** built-in viewer with SyncTeX, precise source-to-PDF and PDF-to-source jumps that
  land on the exact word, and a detachable PDF window.
- **Beamer presentations:** audience view on the external display plus a presenter view with next slide, timer and notes.
- **Writing tools:** autocomplete for commands, environments, references, citations and packages; word and page
  counts; Command Palette; editable shortcuts; optional Vim mode.
- **Project labels, Touch Bar support and a bilingual interface** (English and Brazilian Portuguese).

<p align="center">
  <img src="docs/assets/screenshots/sync.png" width="800" alt="Jumping between the PDF and the source: the target word is highlighted briefly">
</p>

<p align="center">
  <img src="docs/assets/screenshots/welcome.png" width="640" alt="The Welcome window with recent projects and color labels">
</p>

## Get GabeTeX

- **macOS:** download [GabeTeX.dmg](https://github.com/gabe-rbo/GabeTeX-macOS/releases/latest/download/GabeTeX.dmg),
  drag the app to Applications, and install a TeX distribution such as [MacTeX](https://tug.org/mactex/).
  Installation notes, the first-launch "Open Anyway" step, shortcuts and build instructions are in the
  [GabeTeX-macOS README](https://github.com/gabe-rbo/GabeTeX-macOS#readme).
- **Linux and Windows:** not released yet. One Tauri 2 codebase serves both systems; follow
  [GabeTeX-Linux-Windows](https://github.com/gabe-rbo/GabeTeX-Linux-Windows) (planned packages: AppImage, `.deb`, `.exe`, `.msi`).

The [website](https://gabe-rbo.github.io/GabeTeX/) lists every macOS version with its release notes.

## Repository structure

```text
GabeTeX/
├── GabeTeX-macOS/          submodule → github.com/gabe-rbo/GabeTeX-macOS   (Swift app, releases, CI)
├── GabeTeX-Linux-Windows/  submodule → github.com/gabe-rbo/GabeTeX-Linux-Windows (Tauri 2, in development)
├── docs/              the GabeTeX website (GitHub Pages)
├── .github/           issue and pull request templates, Pages workflow
├── CHANGELOG.md  CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md  LICENSE
└── README.md  README.pt-BR.md
```

Each edition (macOS; Linux + Windows) is an independent repository with its own history, issues and releases. This repository pins a specific
commit of each one.

Clone everything at once:

```sh
git clone --recurse-submodules https://github.com/gabe-rbo/GabeTeX.git
```

If you already cloned without submodules:

```sh
git submodule update --init
```

To update the pinned submodules to the latest commit of their default branches:

```sh
git submodule update --remote
```

## Contributing

Bug reports, ideas and pull requests are welcome, in **English or Portuguese**. Start with
[CONTRIBUTING.md](CONTRIBUTING.md), which explains how to pick the right repository, then follow the guide of that
platform. Platform-specific bugs belong in the platform repository's issue tracker.

## License

GabeTeX is released under the [MIT License](LICENSE). Copyright © 2026 Gabriel Ribeiro.
