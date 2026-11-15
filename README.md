# ECE Hub

Electronics news plus a guided component explorer and study tools for ECE students.
Next.js 16 (App Router) · React 19 · TypeScript strict + Zod · Postgres + Drizzle · Inngest · Tailwind 4.

## Setup
```bash
pnpm create next-app@latest ece-hub --ts --tailwind --app --src-dir   # copy these files over the scaffold
pnpm add zod drizzle-orm pg fast-xml-parser inngest@3 @t3-oss/env-nextjs
pnpm add -D drizzle-kit @types/pg vitest
echo 'DATABASE_URL=postgresql://user:pass@host:5432/db' > .env.local  # use the pooled URL
pnpm drizzle-kit push
pnpm dlx inngest-cli@latest dev    # runs the 30-minute ingest (point it at /api/inngest)
pnpm dev                           # /news and /components
pnpm vitest run
```

## What is here
- `modules/news`: 7-source RSS ingest (10 s abort timeout, exponential backoff with jitter, feed auto-discovery, SHA-256 change detection, https-only links).
- `server/jobs/ingest-news.ts`: Inngest cron, one isolated step per source so one failure never blocks the rest.
- `modules/components`: part number in, guided path out (pinout, datasheet, hookup, CAD, buy) across DigiKey, Mouser, AllDatasheet, Datasheet Archive, Components101, Last Minute Engineers, Random Nerd Tutorials, Adafruit, SparkFun, Ultra Librarian, Component Search Engine. Sites are deep-linked, not scraped.
- `modules/study`: resistor, LED, divider, RC and 555 calculators plus an SM-2 spaced-repetition scheduler, with tests.
