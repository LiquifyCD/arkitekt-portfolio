import { defineConfig } from "astro/config";

export default defineConfig({
  // GitHub Pages serverar projektsajten från /<repo>/. Byt båda vid egen domän.
  site: "https://liquifycd.github.io",
  base: "/arkitekt-portfolio/",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto", format: "directory" },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  image: { responsiveStyles: true },
});
