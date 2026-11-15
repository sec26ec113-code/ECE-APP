import { serve } from "inngest/next";
import { inngest, ingestNews } from "@/server/jobs/ingest-news";

export const { GET, POST, PUT } = serve({ client: inngest, functions: [ingestNews] });
