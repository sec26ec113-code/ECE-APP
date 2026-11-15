import { index, integer, pgTable, primaryKey, real, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

const ts = () => timestamp({ withTimezone: true }).notNull();

export const articles = pgTable(
  "articles",
  {
    id: uuid().primaryKey().defaultRandom(),
    sourceId: text().notNull(),
    url: text().notNull(),
    title: text().notNull(),
    summary: text().notNull().default(""),
    contentHash: text().notNull(),
    publishedAt: ts(),
    fetchedAt: ts().defaultNow(),
  },
  (t) => [uniqueIndex("articles_url_uq").on(t.url), index("articles_published_idx").on(t.publishedAt)],
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text().notNull(),
    articleId: uuid().notNull().references(() => articles.id, { onDelete: "cascade" }),
    createdAt: ts().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.articleId] })],
);

export const cards = pgTable(
  "cards",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text().notNull(),
    front: text().notNull(),
    back: text().notNull(),
    ease: real().notNull().default(2.5),
    intervalDays: integer().notNull().default(0),
    reps: integer().notNull().default(0),
    dueAt: ts().defaultNow(),
  },
  (t) => [index("cards_due_idx").on(t.userId, t.dueAt)],
);
