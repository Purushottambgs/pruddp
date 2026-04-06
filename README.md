<<<<<<< HEAD
# Pruddo

> Real reviews. Real prices. Before you buy.

Pruddo is an AI-powered shopping assistant with a Chrome extension and website. It aggregates reviews from Reddit, YouTube, and Amazon, generates AI trust scores, shows price history, and monetizes through affiliate links.

---

## Repository Structure

```
pruddo/
  apps/
    web/        — Next.js 15 website (pruddo.ai)
    api/        — Hono API server (api.pruddo.ai)
    worker/     — BullMQ background job processor
    extension/  — Chrome Manifest V3 extension
  packages/
    shared/     — TypeScript types, constants, utilities
    db/         — Drizzle ORM schema + migrations
    ai/         — Claude API prompts + trust score logic
    affiliate/  — Affiliate link wrapping + tracking
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- PostgreSQL (or Railway PostgreSQL add-on)
- Redis (or Railway Redis add-on)

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd pruddo
pnpm install
```

### 2. Environment variables

Create `.env` files in each app:

**apps/api/.env**
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/pruddo
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
AMAZON_AFFILIATE_TAG=pruddo-20
```

**apps/web/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**apps/worker/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pruddo
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Database setup

```bash
# Push schema to database (first time)
cd packages/db
pnpm db:push

# Or generate + run migrations
pnpm db:generate
pnpm db:migrate
```

## Development

Start all apps simultaneously with Turborepo:

```bash
pnpm dev
```

Or start individual apps:

```bash
pnpm --filter @pruddo/web dev       # http://localhost:3000
pnpm --filter @pruddo/api dev       # http://localhost:3001
pnpm --filter @pruddo/worker dev
pnpm --filter @pruddo/extension dev # outputs to apps/extension/dist/
```

## Chrome Extension

1. Run `pnpm --filter @pruddo/extension build`
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select `apps/extension/dist/`

The extension auto-detects Amazon product pages (`amazon.com/dp/...`) and opens the Pruddo side panel.

## Building for Production

```bash
pnpm build
```

- **web**: outputs standalone Next.js bundle in `apps/web/.next/`
- **api**: outputs compiled JS in `apps/api/dist/`
- **worker**: outputs compiled JS in `apps/worker/dist/`
- **extension**: outputs packed extension in `apps/extension/dist/`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Website | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| API | Hono, Node.js, Zod |
| Background jobs | BullMQ, Redis, ioredis |
| Database | PostgreSQL, Drizzle ORM |
| Extension | Chrome MV3, React + Vite |
| AI | Anthropic Claude (claude-opus-4-6) |
| Auth | Better Auth |
| Email | Resend |
| Hosting | Railway |
| CDN | Cloudflare |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/products/identify` | Identify product from URL/ASIN |
| GET | `/products/:id/score` | AI trust score |
| GET | `/products/:id/reviews` | Review summaries |
| GET | `/products/:id/prices` | Price comparison |
| GET | `/products/:id/price-history` | 30-day price history |
| GET | `/search?q=...` | Search products |
| POST | `/clicks/track` | Track affiliate click |
=======
# pruddp
>>>>>>> ea84e578d6f409a437e739a83457a81f7ef5a2d0
