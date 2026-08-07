# CONTEXT.md — Glossary for mcp_pdf2md

## Domain

- **MCP (Model Context Protocol)** — JSON-RPC protocol connecting AI agents to tools over stdio/SSE
- **pdf2md** — Rust CLI tool (pdf-inspector) for AI-optimized PDF → Markdown extraction
- **Scanned PDF** — image-based PDF requiring OCR; pdf2md detects and returns early

## Architecture

- `pdf2md-server.mjs` — single-file MCP server, spawns `pdf2md` as subprocess
- Two tools: `pdf_to_markdown` (full conversion), `detect_pdf_type` (classification)
- Communicates with pdf2md CLI via child process stdout/stderr

## Conventions

- **Language:** Node.js (ESM)
- **Package manager:** npm
- **Testing:** Node built-in test runner (to be added)
- **CI/CD:** GitHub Actions (to be added)
- **Versioning:** semantic via git-cliff
