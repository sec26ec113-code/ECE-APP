export const PATH = [
  { name: "Pinouts & modules", why: "Learn what each pin does and how the part is normally wired." },
  { name: "Datasheets", why: "Confirm limits and timing in the manufacturer's own numbers." },
  { name: "Hookup guides", why: "Follow a tested circuit and code on a breadboard." },
  { name: "CAD & footprints", why: "Get a verified symbol and footprint for your PCB." },
  { name: "Buy & stock", why: "Check price, stock and lifecycle before you commit the design." },
] as const;
export type Category = (typeof PATH)[number]["name"];

export type Resource = { id: string; name: string; category: Category; teaches: string; url: (q: string) => string };

const e = encodeURIComponent;
const site = (domain: string) => (q: string) => `https://duckduckgo.com/?q=${e(`site:${domain} ${q}`)}`;

export const RESOURCES: Resource[] = [
  { id: "components101", name: "Components101", category: "Pinouts & modules", teaches: "Pinout, working principle, specs and typical circuits", url: site("components101.com") },
  { id: "lme", name: "Last Minute Engineers", category: "Pinouts & modules", teaches: "How a module works, step by step with Arduino", url: (q) => `https://lastminuteengineers.com/?s=${e(q)}` },
  { id: "rnt", name: "Random Nerd Tutorials", category: "Pinouts & modules", teaches: "ESP32, ESP8266 and Arduino projects with code", url: (q) => `https://randomnerdtutorials.com/?s=${e(q)}` },
  { id: "alldatasheet", name: "AllDatasheet", category: "Datasheets", teaches: "Absolute maximum ratings and electrical characteristics", url: (q) => `https://www.alldatasheet.com/view.jsp?Searchword=${e(q)}` },
  { id: "datasheetarchive", name: "Datasheet Archive", category: "Datasheets", teaches: "Older and discontinued parts, equivalents", url: (q) => `https://www.datasheetarchive.com/?q=${e(q)}` },
  { id: "adafruit", name: "Adafruit Learn", category: "Hookup guides", teaches: "Wiring diagrams, CircuitPython and library setup", url: (q) => `https://learn.adafruit.com/search?q=${e(q)}` },
  { id: "sparkfun", name: "SparkFun Tutorials", category: "Hookup guides", teaches: "Breakout hookup guides and concept primers", url: site("learn.sparkfun.com") },
  { id: "ultralibrarian", name: "Ultra Librarian", category: "CAD & footprints", teaches: "Symbols, footprints and 3D models for major EDA tools", url: (q) => `https://app.ultralibrarian.com/search?queryText=${e(q)}` },
  { id: "cse", name: "Component Search Engine", category: "CAD & footprints", teaches: "Free verified libraries for KiCad, Eagle and Altium", url: (q) => `https://componentsearchengine.com/search?term=${e(q)}` },
  { id: "digikey", name: "DigiKey", category: "Buy & stock", teaches: "Parametric filters, price breaks and lifecycle status", url: (q) => `https://www.digikey.com/en/products/result?keywords=${e(q)}` },
  { id: "mouser", name: "Mouser", category: "Buy & stock", teaches: "Stock, alternatives and manufacturer links", url: (q) => `https://www.mouser.com/c/?q=${e(q)}` },
];

export const CHECKLIST = [
  "Absolute maximum ratings: limits you must never exceed.",
  "Recommended operating conditions: where the part meets its specs.",
  "Pin description and package: match the pins to your footprint.",
  "Electrical characteristics: guaranteed minimum, typical and maximum values.",
  "Typical application circuit: copy it before you improvise.",
  "Thermal data and ordering code: confirm heat limits and the exact variant.",
];
