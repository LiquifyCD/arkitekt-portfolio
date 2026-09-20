import { defineConfig } from "astro/config";

export default defineConfig({
  // Byt till den riktiga domänen innan publicering — styr sitemap och og:url.
  site: "https://arkitekt.example.se",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto", format: "directory" },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  image: { responsiveStyles: true },
});
