# Arkitektportfölj

Statisk sajt byggd med Astro. Svenskspråkig, innehållet ligger som filer i
repot — att lägga till ett projekt är en commit.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # bygger till dist/
npm run preview  # förhandsvisar dist/
npm run bilder   # genererar om platshållarbilderna
```

## Först av allt: byt identitet

Allt som är personligt ligger i **`src/consts.ts`** — namn, titel, ort, ingress,
e-post, telefon, sociala länkar, navigering och kategorier. Det är den enda fil
du behöver röra för att göra sajten till någon annans.

Byt även `site` i `astro.config.mjs` till den riktiga domänen innan publicering.

## Lägga till ett projekt

Skapa en fil i `src/innehall/projekt/<slug>.md`. Filnamnet blir adressen:
`kajhuset.md` → `/projekt/kajhuset`.

```yaml
---
titel: Kajhuset
ar: 2024
kategori: bostad # bostad | renovering | stadsbyggnad | publika-byggnader
plats: Frihamnen, Göteborg
status: pågående # byggt | ej byggt | tävling | pågående
roll: Handläggande arkitekt
area: 4 200 m² # valfri
ordning: 2 # lägre tal hamnar först under "Urval"
omslag: kajhuset-01.jpg
sammanfattning: >-
  Två meningar som syns på projektkortet och i sökresultat.
relaterade: [villa-bergsklinten] # valfri; annars väljs samma kategori
uppslag:
  - typ: helbild
    bild: kajhuset-01.jpg
    bildtext: Fasad mot älven.
---

Brödtexten hamnar under faktarutan, före boken.
```

### Uppslagstyper

Ett uppslag är en sida i boken. Fem typer:

| `typ`       | Fält som används                 | Ger                        |
| ----------- | -------------------------------- | -------------------------- |
| `helbild`   | `bild`, `bildtext`               | En bild över hela uppslaget |
| `bild-text` | `bild`, `bildtext`, `rubrik`, `text` | Bild vänster, text höger |
| `text-bild` | samma som ovan                   | Text vänster, bild höger   |
| `bild-bild` | `bild`, `bild2`, `bildtext`      | Två bilder sida vid sida   |
| `text`      | `rubrik`, `text`                 | Enbart text, centrerad     |

## Bilder

Lägg filerna i **`src/bilder/`** och referera till dem med enbart filnamnet.
Astro skalar och konverterar dem till webp vid bygget — lägg in dem i full
upplösning, inte nedskalade.

Bilderna som ligger där nu är genererade platshållare i ritningsstil
(`scripts/generera-platshallare.mjs`). Skriv över dem med riktiga foton,
behåll filnamnen, så behöver inget innehåll ändras.

## Galleriet

Modellgalleriet är en egen samling: `src/innehall/galleri/<namn>.md` med
`bild`, `bildtext`, `material`, `skala`, `ar` och `ordning`.

## Manifestfilmen

Konfigureras i `FILM` i `src/consts.ts`. Bädden laddas först när besökaren
klickar på affischbilden, så inga tredjepartskakor sätts innan dess. Lämna
`id` tomt om det inte finns någon film än.

## CV

Ersätt `public/cv.pdf`. Filen som ligger där är en platshållare.

## Dela prototypen innan innehållet finns

```bash
PUBLIC_DEMO=1 npm run build
```

Sätter en rad i kolofonen om att namn, projekt och kontaktuppgifter är
påhittade. Bygg utan flaggan för skarp publicering.

## Designsystemet

Tokens finns i `src/stilar/tokens.css`.

- **Papper** `#F3EFE7` och **grafit** `#1E1D1B`: varm, lugn grund
- **Kategorifärgerna** i `KATEGORIER` (`src/consts.ts`) är sajtens enda starka
  färger: en ruta i menyn, på korten och på `/projekt`
- **Typsnitt**: Familjen Grotesk (rubriker), Newsreader (brödtext),
  Spline Sans Mono (etiketter). Alla self-hostade via fontsource, inga anrop
  till Googles CDN.

Sajtens signatur är **menyn** (idén från liljewall.se): en panel från höger,
och när Projekt öppnas läggs kategorierna ut bredvid. Pekar man på en kategori
tonas resten av sidan i en svagare nyans av dess färg.

## Skrivet av mig

Texterna ligger i `src/innehall/texter/<slug>.md` med `titel`, `ar`, `slag`,
`sammanfattning`, `ordning` och `uppslag` (samma uppslagstyper som projekten).
De läses som en pappersbok på `/skrivet/<slug>`. Vilken text som ligger i boken
på startsidan, och vilket projekt som visas under "Ta en extra kik!", styrs av
`STARTSIDA` i `src/consts.ts`.

## Boken

Projektsidorna bläddras som en bok på skärmar bredare än 860 px: piltangenter,
knappar eller svep, ett uppslag i taget. På smalare skärmar — och helt utan
JavaScript — ligger uppslagen efter varandra och rullas som vanligt.

## Publicering

Sajten ligger på Cloudflare Pages, kopplad till det här repot. Varje push till
`main` bygger och publicerar; pull requests får egna förhandsadresser.

| Inställning         | Värde           |
| ------------------- | --------------- |
| Framework preset    | Astro           |
| Build command       | `npm run build` |
| Build output        | `dist`          |
| `NODE_VERSION`      | `22`            |
| `PUBLIC_DEMO`       | `1` (ta bort vid skarp publicering) |
| `SITE_URL`          | sajtens adress, t.ex. `https://arkitekt-portfolio.pages.dev` |

Vill du köra den själv i stället finns `docker compose up -d --build`, som
lyssnar på `127.0.0.1:8088` bakom en reverse proxy.
