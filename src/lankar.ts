// Sajten behöver kunna ligga i en underkatalog (GitHub Pages serverar
// projektsajter från /<repo>/). Astro prefixar bilder och stilmallar med basen
// själv, men inte handskrivna href — de går genom intern().

const BAS = import.meta.env.BASE_URL.replace(/\/$/, "");

export function intern(sokvag: string): string {
  return `${BAS}${sokvag}`;
}

// Motsatsen: gör en pathname jämförbar med sökvägarna i NAV.
export function utanBas(pathname: string): string {
  const ren = BAS && pathname.startsWith(BAS) ? pathname.slice(BAS.length) : pathname;
  return ren.replace(/\/$/, "") || "/";
}
