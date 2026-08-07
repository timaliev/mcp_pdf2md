# Development — mcp_pdf2md

## Setup

```bash
git clone https://github.com/timaliev/mcp_pdf2md.git
cd mcp_pdf2md
npm install
```

## Prerequisites

- [pdf2md](https://github.com/pdf-inspector/pdf2md) CLI (`cargo install pdf2md` or `brew install pdf2md`)
- Node.js 18+

## Run

```bash
node pdf2md-server.mjs
```

## Linting & formatting

```bash
npx biome check .        # lint
npx biome check --fix .  # auto-fix
npx biome format .       # format
```

## Git workflow

- NEVER work directly on `develop` or `master`
- Create feature branch from `develop`: `git checkout -b feat/my-feature develop`
- Commit using [conventional commits](https://www.conventionalcommits.org/)
- Open PR to `develop`
- Release: merge `develop` → `release` → PR → `master` (GitHub Actions handles tags + CHANGELOG)
