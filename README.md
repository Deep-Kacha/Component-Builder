# Component Builder

Generate React + Tailwind components with AI and preview them live. Powered by the [Cursor SDK](https://cursor.com/docs/sdk/typescript).

| | |
|---|---|
| **Live demo** | [component-builder-three.vercel.app](https://component-builder-three.vercel.app) |
| **GitHub** | [github.com/Deep-Kacha/Component-Builder](https://github.com/Deep-Kacha/Component-Builder) |

---

## What it does

1. Describe a UI component in the chat (e.g. *"a pricing card with three tiers"*)
2. Click **Generate** — the Cursor cloud agent writes React + Tailwind code (~25–35 seconds)
3. View the **live preview** in the Output panel, or switch to **Code** to copy the source

---

## Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)
- A **Cursor API key** from [cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations)

---

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/Deep-Kacha/Component-Builder.git
cd Component-Builder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set your API key:

```env
CURSOR_API_KEY=your_cursor_api_key_here
```

> **Never commit `.env.local`** — it is gitignored. Only `.env.local.example` is tracked.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using the app

### Generate a component

1. Type a description in the chat input (or click an example suggestion)
2. Press **Enter** or click **Generate**
3. Wait for the loading spinner to finish (~25–35 seconds)
4. Check the **Preview** tab for the live render, or **Code** to copy the source

### Access from other devices (LAN)

The dev server binds to `0.0.0.0`. Use the **Network** URL printed in the terminal:

```
Network: http://192.168.x.x:3000
```

On plain HTTP (LAN IP), the app automatically uses an iframe preview instead of Sandpack, because browsers block `crypto.subtle` outside secure contexts.

### Example prompts

- *"A pricing card with three tiers and a highlighted plan"*
- *"A login form with email, password, and social buttons"*
- *"A stats dashboard widget with icons and trend indicators"*

---

## Project structure

```
Component-Builder/
├── app/
│   ├── api/generate/route.ts   # API endpoint — calls Cursor SDK
│   ├── page.tsx                # Main UI (chat + preview)
│   └── layout.tsx
├── components/
│   ├── ChatPanel.tsx           # Chat input and message history
│   ├── PreviewPanel.tsx        # Preview / Code tab switcher
│   ├── LivePreview.tsx         # Picks Sandpack or iframe renderer
│   ├── SandpackLivePreview.tsx # Preview for localhost / HTTPS
│   ├── IframeLivePreview.tsx   # Preview for LAN HTTP
│   └── CodeViewer.tsx          # Syntax-highlighted code + copy
├── lib/
│   ├── generateComponent.ts    # Shared Cursor SDK generation logic
│   ├── extractCodeBlock.ts     # Parses ```tsx blocks from agent output
│   └── preparePreviewCode.ts   # Prepares code for iframe preview
├── mcp/
│   └── server.ts               # MCP server (generate_component tool)
├── e2e/                        # Playwright end-to-end tests
├── scripts/                    # API test helpers
├── .cursor/mcp.json            # Cursor IDE MCP configuration
└── vercel.json                 # Vercel function timeout config
```

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on `0.0.0.0:3000` |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server locally |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright tests (mocked API) |
| `npm run test:e2e:live` | Run live API test (requires `CURSOR_API_KEY`) |
| `npm run test:api` | Smoke-test `/api/generate` on localhost |
| `npm run test:unit` | Run unit tests |
| `npm run mcp` | Start the MCP server (stdio) |
| `npm run mcp:verify` | Verify MCP tools register correctly |

### Testing the API

**Node (recommended):**

```bash
npm run test:api
```

**PowerShell (use `Invoke-RestMethod`, not `Invoke-WebRequest`):**

```powershell
.\scripts\test-generate-api.ps1
.\scripts\test-generate-api.ps1 -BaseUrl "http://192.168.x.x:3000"
```

**Live E2E test (PowerShell):**

```powershell
$env:E2E_LIVE = "1"
npm run test:e2e:live
```

---

## MCP server (Cursor IDE)

This project includes an MCP server so you can generate components directly from Cursor chat.

### Setup

1. Ensure `CURSOR_API_KEY` is set in `.env.local`
2. The project already includes `.cursor/mcp.json`
3. In Cursor, go to **Settings → MCP** and reload the **component-builder** server
4. Use the `generate_component` tool with a `prompt` describing the component

### Manual start

```bash
npm run mcp
```

Verify it works:

```bash
npm run mcp:verify
```

---

## Deployment (Vercel)

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Deep-Kacha/Component-Builder&env=CURSOR_API_KEY&envDescription=Cursor%20API%20key%20for%20component%20generation&project-name=component-builder)

### Manual deploy

1. Import [github.com/Deep-Kacha/Component-Builder](https://github.com/Deep-Kacha/Component-Builder) in [Vercel](https://vercel.com/new)
2. Add the environment variable:

   | Variable | Value |
   |----------|-------|
   | `CURSOR_API_KEY` | Your Cursor API key |

3. Deploy

Or use the Vercel CLI:

```bash
npx vercel login
npx vercel deploy --prod
```

**Production URL:** [component-builder-three.vercel.app](https://component-builder-three.vercel.app)

---

## Environment variables

| Variable | Required | Where | Description |
|----------|----------|-------|-------------|
| `CURSOR_API_KEY` | Yes | `.env.local` / Vercel | Cursor API key for cloud agent generation |

Get your key at [cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations).

---

## Troubleshooting

### "CURSOR_API_KEY is not configured"

Copy `.env.local.example` to `.env.local` and add your key. Restart the dev server.

### Generation takes a long time

Cloud generation normally takes **25–35 seconds**. Wait for the spinner to finish before assuming it failed.

### Preview crashes on Network URL (`crypto.subtle digest` error)

Browsers block `crypto.subtle` on plain HTTP. The app automatically falls back to an iframe preview on LAN IPs. Use `http://localhost:3000` for the Sandpack preview, or access via HTTPS in production.

### PowerShell API test hangs

`Invoke-WebRequest` hangs on Windows for long responses. Use the provided script instead:

```powershell
.\scripts\test-generate-api.ps1 -TimeoutSec 120
```

### Preview panel not visible on mobile

The layout shows chat on top and preview below on smaller screens. Scroll down after generation to see the Output panel.

### MCP server shows no tools

1. Confirm `CURSOR_API_KEY` is in `.env.local`
2. Run `npm run mcp:verify`
3. Toggle the MCP server off/on in Cursor Settings

---

## Tech stack

- [Next.js 16](https://nextjs.org/) — App Router, API routes
- [Cursor SDK](https://cursor.com/docs/sdk/typescript) — Cloud agent for code generation
- [Sandpack](https://sandpack.codesandbox.io/) — Live preview (secure contexts)
- [Tailwind CSS](https://tailwindcss.com/) — Component styling
- [Playwright](https://playwright.dev/) — E2E testing
- [MCP SDK](https://modelcontextprotocol.io/) — Cursor IDE integration

---

## License

Private project. All rights reserved.
