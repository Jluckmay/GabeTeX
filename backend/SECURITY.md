# GabeTeX Backend — Security Design

This document describes the security measures implemented in the GabeTeX online LaTeX editor backend (example implementation).

## Threat model

The backend receives arbitrary LaTeX source from untrusted users and compiles it to PDF. The primary risks are:

1. **Arbitrary file access** — LaTeX `\input`, `\include`, `\read`, `\write`, `\openout` can read/write files.
2. **Shell command execution** — `\write18`, `\immediate\write18`, `\directlua` can run OS commands.
3. **Denial of service** — Infinite loops, very large documents, or slow compilation can exhaust resources.
4. **Cross-site request forgery (CSRF)** — Malicious sites could trigger compilation on behalf of authenticated users.
5. **Information leakage** — Error messages or temp files could reveal system details.

## Countermeasures

### 1. Same-origin communication only

The frontend sends `credentials: 'same-origin'` and the backend sets `cors({ origin: false, credentials: true })`. No third-party origins can reach the API.

### 2. CSRF protection

A CSRF token is issued via `GET /api/csrf` (cookie-based). All state-changing requests (`POST /api/compile`) require the `X-CSRF-Token` header, which cannot be read by cross-origin scripts due to the same-origin policy.

### 3. Rate limiting

`express-rate-limit` restricts compilation to 10 requests per minute per IP. Excess requests receive HTTP 429.

### 4. Input validation (dangerous command blocklist)

Before compilation, the source is scanned for a blocklist of dangerous LaTeX primitives (`\input`, `\write18`, `\directlua`, `\special`, etc.). Any match causes immediate rejection with HTTP 400.

### 5. Sandboxed compilation

Each compile job runs in a unique temporary directory (`mkdtemp`). The working directory is isolated, and `pdflatex` is invoked with `-output-directory` pointing to the temp dir. After compilation (success or failure), the temp directory and all contents are deleted.

### 6. No shell execution

`pdflatex` is invoked via `child_process.execFile` with a fixed argument array — never through a shell. This prevents shell injection.

### 7. Minimal environment

The child process receives a minimal `PATH` (`/usr/bin:/bin`) and no inherited environment variables beyond the system baseline.

### 8. Compilation timeout

A 30-second hard timeout kills runaway compilation processes.

### 9. Payload size limit

JSON bodies are limited to 256 KB to prevent excessively large documents.

### 10. Content Security Policy

`helmet` sets a strict CSP: scripts and styles from same-origin only, no objects, no frames, no inline eval.

## Deployment recommendations

- Run the backend behind a reverse proxy (nginx, Cloudflare) with TLS.
- Run `pdflatex` inside a Docker container with `--read-only` filesystem and no network.
- Drop privileges before invoking `pdflatex` (run as non-root user).
- Monitor `/tmp` for leftover temp directories and clean them periodically.
- Consider using `latexmk` with `-jobname` and restricted shell escape instead of raw `pdflatex`.

## Limitations

This is a reference implementation. Production use requires additional hardening (containerization, user namespaces, seccomp profiles, etc.).
