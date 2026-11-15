import { createHash } from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import type { Source } from "./news.sources";

export type Item = { url: string; title: string; summary: string; publishedAt: Date; contentHash: string };

const UA = "ECEHub/1.0 (student news reader)";
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", htmlEntities: true });
const arr = (v: unknown): unknown[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const txt = (v: unknown): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : v && typeof v === "object" && "#text" in v ? txt((v as Record<string, unknown>)["#text"]) : "";

/** Plain text only: scripts, styles, iframes, comments and all tags are removed before hashing or display. */
export const clean = (html: string): string =>
  html
    .replace(/<(script|style|noscript|iframe)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

class Fatal extends Error {}

async function fetchText(url: string, timeoutMs = 10_000, retries = 3): Promise<string> {
  let last: Error = new Error("fetch failed");
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ctl.signal,
        redirect: "follow",
        headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, text/xml, text/html;q=0.8" },
      });
      if (res.ok) return await res.text();
      const err = new Error(`HTTP ${res.status}`);
      if (res.status !== 429 && res.status < 500) throw new Fatal(err.message);
      last = err;
    } catch (e) {
      if (e instanceof Fatal) throw e;
      last = e instanceof Error ? e : new Error(String(e));
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) await sleep(500 * 2 ** attempt + Math.random() * 250);
  }
  throw last;
}

export function parseFeed(xml: string): Item[] {
  const root = parser.parse(xml) as { rss?: { channel?: { item?: unknown } }; feed?: { entry?: unknown } };
  const rows = root.rss ? arr(root.rss.channel?.item) : arr(root.feed?.entry);
  const out: Item[] = [];
  for (const row of rows as Record<string, unknown>[]) {
    const link = arr(row.link)[0];
    const url = (typeof link === "string" ? link : txt((link as Record<string, unknown> | undefined)?.["@_href"])).trim();
    const title = clean(txt(row.title)).slice(0, 300);
    if (!title || !/^https?:\/\//i.test(url)) continue;
    const summary = clean(txt(row.description ?? row.summary ?? row["content:encoded"])).slice(0, 400);
    const d = new Date(txt(row.pubDate ?? row.published ?? row.updated));
    out.push({
      url,
      title,
      summary,
      publishedAt: Number.isNaN(d.getTime()) ? new Date() : d,
      contentHash: createHash("sha256").update(`${title}\n${summary}`).digest("hex"),
    });
  }
  return out;
}

async function discover(home: string): Promise<string[]> {
  const html = await fetchText(home, 10_000, 1);
  return [...html.matchAll(/<link\b[^>]*type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi)]
    .map((m) => /href=["']([^"']+)["']/i.exec(m[0])?.[1])
    .filter((h): h is string => Boolean(h))
    .map((h) => new URL(h, home).href);
}

/** Tries the known feeds first, then falls back to feed auto-discovery on the homepage. */
export async function fetchSource(src: Source): Promise<Item[]> {
  const errors: string[] = [];
  const tried = new Set<string>();
  const run = async (feeds: string[]): Promise<Item[] | null> => {
    for (const f of feeds) {
      if (tried.has(f)) continue;
      tried.add(f);
      try {
        const items = parseFeed(await fetchText(f));
        if (items.length) return items;
        errors.push(`${f}: no items`);
      } catch (e) {
        errors.push(`${f}: ${e instanceof Error ? e.message : "error"}`);
      }
    }
    return null;
  };
  const direct = await run(src.feeds);
  if (direct) return direct;
  try {
    const found = await run(await discover(src.home));
    if (found) return found;
  } catch (e) {
    errors.push(`discover: ${e instanceof Error ? e.message : "error"}`);
  }
  throw new Error(`${src.id} failed: ${errors.join(" | ")}`);
}
