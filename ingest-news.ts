import { Inngest } from "inngest";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { articles } from "@/server/db/schema";
import { SOURCES } from "@/modules/news/news.sources";
import { fetchSource } from "@/modules/news/news.fetcher";

export const inngest = new Inngest({ id: "ece-hub" });

export const ingestNews = inngest.createFunction(
  { id: "ingest-news", concurrency: 1 },
  { cron: "*/30 * * * *" },
  async ({ step }) => {
    const report: Record<string, string> = {};
    for (const s of SOURCES) {
      report[s.id] = await step.run(`fetch-${s.id}`, async () => {
        try {
          const items = await fetchSource(s);
          const unique = [...new Map(items.map((i) => [i.url, i])).values()];
          await db
            .insert(articles)
            .values(unique.map((i) => ({ sourceId: s.id, ...i })))
            .onConflictDoUpdate({
              target: articles.url,
              set: { title: sql`excluded.title`, summary: sql`excluded.summary`, contentHash: sql`excluded.content_hash` },
              setWhere: sql`${articles.contentHash} <> excluded.content_hash`,
            });
          return `ok:${unique.length}`;
        } catch (e) {
          return `error:${e instanceof Error ? e.message : "unknown"}`;
        }
      });
    }
    return report;
  },
);
