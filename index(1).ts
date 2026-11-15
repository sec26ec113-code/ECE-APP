import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";
import * as schema from "./schema";

const g = globalThis as unknown as { pgPool?: Pool };
const pool = (g.pgPool ??= new Pool({ connectionString: env.DATABASE_URL, max: 10 }));

export const db = drizzle(pool, { schema, casing: "snake_case" });
