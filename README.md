# Component Builder

Generate React + Tailwind components with AI and preview them live. Powered by the [Cursor SDK](https://cursor.com/docs/sdk/typescript).

## Features

- Chat UI to describe UI components in natural language
- Live preview (Sandpack on secure origins, iframe fallback on LAN HTTP)
- Code view with syntax highlighting and copy
- MCP server (`generate_component` tool) for Cursor IDE
- E2E tests with Playwright

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Add your API key from [Cursor Dashboard → Integrations](https://cursor.com/dashboard/integrations):

```
CURSOR_API_KEY=your_key_here
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Generation takes about 25–35 seconds.

To test from other devices on your network, use the Network URL shown in the terminal (e.g. `http://192.168.x.x:3000`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (binds to `0.0.0.0`) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test:e2e` | Run Playwright tests (mocked API) |
| `npm run test:api` | Smoke-test `/api/generate` |
| `npm run mcp` | Start MCP server (stdio) |
| `npm run mcp:verify` | Verify MCP tools register |

## MCP (Cursor IDE)

The project includes `.cursor/mcp.json`. After setting `CURSOR_API_KEY` in `.env.local`, reload MCP in Cursor Settings. The `generate_component` tool will be available in chat.

## Deploy (Vercel)

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variable: `CURSOR_API_KEY`
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PLACEHOLDER/Component-Builder&env=CURSOR_API_KEY&envDescription=Cursor%20API%20key%20for%20component%20generation&project-name=component-builder)

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CURSOR_API_KEY` | Yes | Cursor API key for cloud agent generation |
