import { defineConfig } from "astro/config";

export default defineConfig({
  // Cloudflare Pages serverar från roten. SITE_URL sätts i Pages-projektets
  // miljövariabler (t.ex. vid egen domän) och styr kanoniska länkar.
  site: process.env.SITE_URL ?? "https://arkitekt-portfolio.pages.dev",
  base: "/",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto", format: "directory" },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  image: { responsiveStyles: true },
});
