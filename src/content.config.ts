import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { KATEGORIER } from "./consts";

const kategoriNycklar = Object.keys(KATEGORIER) as [keyof typeof KATEGORIER];

// Ett uppslag är en sida i boken. Typen avgör hur den sätts.
const uppslag = z.object({
  typ: z.enum(["helbild", "bild-text", "text-bild", "bild-bild", "text"]),
  bild: z.string().optional(),
  bild2: z.string().optional(),
  bildtext: z.string().optional(),
  rubrik: z.string().optional(),
  text: z.string().optional(),
});

const projekt = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/innehall/projekt" }),
  schema: z.object({
    titel: z.string(),
    ar: z.number(),
    kategori: z.enum(kategoriNycklar),
    plats: z.string(),
    status: z.enum(["byggt", "ej byggt", "tävling", "pågående"]),
    roll: z.string(),
    area: z.string().optional(),
    sammanfattning: z.string(),
    omslag: z.string(),
    // Lägre tal hamnar först i "Urval"-ordningen på /projekt.
    ordning: z.number().default(100),
    // Utelämnas relaterade väljs projekt i samma kategori automatiskt.
    relaterade: z.array(z.string()).optional(),
    uppslag: z.array(uppslag).default([]),
  }),
});

// Skrivet av mig. Varje text läses som en bok, uppslag för uppslag.
const texter = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/innehall/texter" }),
  schema: z.object({
    titel: z.string(),
    ar: z.number(),
    // Vad texten är, t.ex. "Kandidatuppsats" eller "Essä".
    slag: z.string(),
    sammanfattning: z.string(),
    ordning: z.number().default(100),
    uppslag: z.array(uppslag).default([]),
  }),
});

const galleri = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/innehall/galleri" }),
  schema: z.object({
    bild: z.string(),
    bildtext: z.string(),
    material: z.string().optional(),
    skala: z.string().optional(),
    ar: z.number(),
    ordning: z.number().default(100),
  }),
});

export const collections = { projekt, texter, galleri };
