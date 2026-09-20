// Bilder refereras med enbart filnamn i innehållsfilerna ("kajhuset-01.jpg").
// Här slås namnet upp mot src/bilder/ så att Astro kan optimera dem.

const filer = import.meta.glob<{ default: ImageMetadata }>("./bilder/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
});

export function bild(namn: string): ImageMetadata {
  const traff = filer[`./bilder/${namn}`];
  if (!traff) {
    throw new Error(
      `Bilden "${namn}" finns inte i src/bilder/. Lägg filen där, eller rätta filnamnet i innehållsfilen.`,
    );
  }
  return traff.default;
}
