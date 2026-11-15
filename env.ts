import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    INNGEST_SIGNING_KEY: z.string().min(1).optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
});
