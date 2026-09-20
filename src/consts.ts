// Identitet och kontaktuppgifter. Detta är den enda fil du behöver röra för att
// byta namn, kontaktuppgifter, navigering eller kategorier.

export const ARKITEKT = {
  // PLATSHÅLLARE — byt till arkitektens riktiga namn.
  namn: "Ingrid Almqvist",
  titel: "Arkitekt SAR/MSA",
  ort: "Göteborg",
  // En rad som sammanfattar praktiken. Syns under namnet på startsidan.
  ingress:
    "Ritar hus som tar hand om dagsljuset de får. Bostad, publika byggnader och stadsrum i västsvensk skala.",
  epost: "hej@example.se",
  telefon: "+46 70 000 00 00",
  instagram: "https://instagram.com/example",
  linkedin: "https://linkedin.com/in/example",
  cv: "/cv.pdf",
} as const;

export const SAJT = {
  titel: `${ARKITEKT.namn} — ${ARKITEKT.titel}`,
  beskrivning: ARKITEKT.ingress,
  sprak: "sv-SE",
} as const;

// Manifestfilmen. Lämna id tomt så visas affischbilden utan spelare.
// Bädden laddas först när besökaren klickar — inga kakor dessförinnan.
export const FILM = {
  leverantor: "vimeo" as "vimeo" | "youtube",
  id: "76979871",
  titel: "Manifest",
  affisch: "hero-affisch.jpg",
} as const;

export const NAV = [
  { href: "/projekt", text: "Projekt" },
  { href: "/galleri", text: "Galleri" },
  { href: "/metodik", text: "Metodik" },
  { href: "/om-mig", text: "Om mig" },
  { href: "/kontakt", text: "Kontakt" },
] as const;

// Nyckeln används i projektens frontmatter och i filtret på /projekt.
export const KATEGORIER = {
  "i-form-av-ord": "I form av ord",
  inredning: "Inredning",
  bostad: "Bostad",
  "publika-byggnader": "Publika byggnader",
  stadsbyggnad: "Stadsbyggnad",
  skisser: "Skisser",
} as const;

export type Kategori = keyof typeof KATEGORIER;
