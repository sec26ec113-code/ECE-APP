import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  home: z.url(),
  feeds: z.array(z.url()).min(1),
});
export type Source = z.infer<typeof SourceSchema>;

export const SOURCES: Source[] = z.array(SourceSchema).parse([
  { id: "eetimes", name: "EE Times", home: "https://www.eetimes.com", feeds: ["https://www.eetimes.com/feed/"] },
  { id: "aac", name: "All About Circuits", home: "https://www.allaboutcircuits.com", feeds: ["https://www.allaboutcircuits.com/rss/"] },
  { id: "eeworld", name: "EEWorld Online", home: "https://www.eeworldonline.com", feeds: ["https://www.eeworldonline.com/feed/"] },
  { id: "techxplore", name: "Tech Xplore", home: "https://techxplore.com", feeds: ["https://techxplore.com/rss-feed/"] },
  { id: "efy", name: "Electronics For You", home: "https://www.electronicsforu.com", feeds: ["https://www.electronicsforu.com/feed"] },
  {
    id: "etelectronics",
    name: "ET Electronics",
    home: "https://electronics.economictimes.indiatimes.com",
    feeds: ["https://electronics.economictimes.indiatimes.com/rss/topstories"],
  },
  { id: "hackaday", name: "Hackaday", home: "https://hackaday.com", feeds: ["https://hackaday.com/blog/feed/"] },
]);
