// Identitet och kontaktuppgifter. Detta är den enda fil du behöver röra för att
// byta namn, kontaktuppgifter, navigering eller kategorier.

export const ARKITEKT = {
  namn: "Wilma Vallström Bergstrand",
  titel: "Masterstudent i arkitektur",
  ort: "Göteborg",
  // En rad som sammanfattar arbetet. Syns under namnet på startsidan.
  ingress:
    "Arkitekturstudent på Chalmers, masterprogrammet sedan hösten 2026. Om gemenskap, livet, mellanrummen och arkitekturen.",
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

// Filmen överst på startsidan: gemenskap, livet, mellanrummen och arkitekturen.
// Manifestfilmen. Lämna id tomt så visas affischbilden utan spelare.
// Bädden laddas först när besökaren klickar — inga kakor dessförinnan.
export const FILM = {
  leverantor: "vimeo" as "vimeo" | "youtube",
  id: "76979871",
  titel: "Manifest",
  affisch: "hero-affisch.jpg",
} as const;

// Menyn i skissens ordning. Projekt öppnar kategorierna i stället för att länka.
export const NAV = [
  { href: "/projekt", text: "Projekt" },
  { href: "/kontakt", text: "Kontakt" },
  { href: "/om-mig", text: "Om mig" },
  { href: "/skrivet", text: "Skrivet av mig" },
  { href: "/galleri", text: "Fotogalleri" },
] as const;

// Nyckeln används i projektens frontmatter och som ankare på /projekt.
// Färgen är kategorins egen: en ruta i menyn och på korten, och en svagare
// nyans som lägger sig över sidan när kategorin pekas ut i menyn.
export const KATEGORIER = {
  bostad: { namn: "Bostads\u00adprojekt", farg: "#c8623f" },
  renovering: { namn: "Renoverings\u00adprojekt", farg: "#bf9127" },
  stadsbyggnad: { namn: "Stadsbyggnads\u00adprojekt", farg: "#56875a" },
  "publika-byggnader": { namn: "Publika byggnader", farg: "#4a74ac" },
} as const;

export type Kategori = keyof typeof KATEGORIER;

// Startsidans två utvalda: texten i boken och projektet under "Ta en extra kik!".
// Värdena är filnamn utan .md i src/innehall/texter/ och src/innehall/projekt/.
export const STARTSIDA = {
  bok: "ordets-makt",
  extraKik: "biblioteket-i-majorna",
} as const;
