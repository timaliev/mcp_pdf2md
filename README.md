# mcp_pdf2md

MCP server for AI-optimized PDF to Markdown conversion using [pdf2md](https://github.com/pdf-inspector/pdf2md).

> **Requires [pi-mcp-bridge](https://github.com/timaliev/pi-mcp-bridge)** to connect to [pi](https://pi.dev).

## Prerequisites

- [pdf2md](https://github.com/pdf-inspector/pdf2md) CLI installed (`cargo install pdf2md` or `brew install pdf2md`)

## Installation

```bash
npm install -g timaliev/mcp_pdf2md
# or
git clone https://github.com/timaliev/mcp_pdf2md.git
cd mcp_pdf2md && npm link
```

## Configuration

### With pi-mcp-bridge

In `~/.pi/agent/settings.json`:

```json
{
  "mcpBridge": {
    "servers": [
      {
        "name": "pdf2md",
        "command": "mcp-pdf2md",
        "args": []
      }
    ]
  }
}
```

### Standalone MCP client

In `~/.mcp.json`:

```json
{
  "mcpServers": {
    "pdf2md": {
      "command": "mcp-pdf2md",
      "args": []
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `pdf_to_markdown` | Convert PDF to Markdown with page range, raw/compact/page-break options |
| `detect_pdf_type` | Detect PDF type: TextBased, Scanned, Mixed, ImageBased |

## Development

```bash
git clone https://github.com/timaliev/mcp_pdf2md.git
cd mcp_pdf2md
npm install
```
