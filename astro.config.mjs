import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

/**
 * Configuração principal do Astro.
 *
 * - No Astro 5, o modo `static` (padrão) suporta rotas com server endpoints
 *   nativamente, então o painel do Keystatic CMS funciona sem configuração extra.
 * - Tailwind CSS v4 é integrado via plugin Vite (@tailwindcss/vite),
 *   que é a forma correta para Tailwind v4 + Astro 5.
 * - React é necessário para os componentes de UI do Keystatic.
 *
 * Em produção (GitHub Pages), o `site` e `base` devem ser ajustados
 * conforme o repositório. Isso será feito no Passo 7.
 */
const isBuild = process.argv.includes("build");

export default defineConfig({
  vite: {
    plugins: [
      // Tailwind CSS v4: integrado via Vite (não via integração Astro)
      tailwindcss(),
    ],
  },

  integrations: [
    // React: necessário para os componentes interativos do portal
    react(),

    // Keystatic CMS: ativado durante o desenvolvimento para permitir a edição
    // e cadastro via interface gráfica local. Durante o build estático (SSG),
    // o site é compilado como HTML puro para distribuição no GitHub Pages.
    ...(!isBuild ? [keystatic()] : []),
  ],
});
