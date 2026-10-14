import { config, collection, fields } from "@keystatic/core";

// ──────────────────────────────────────────
// Schema compartilhado entre os três tipos de
// legislação (Portarias, Decretos e Leis).
// Qualquer alteração aqui reflete nos três.
// ──────────────────────────────────────────
const legislacaoSchema = {
  /**
   * Número do documento. Usado também como slug (identificador na URL).
   * Exemplo: "001-2024" → URL: /legislacao/portarias/001-2024
   */
  numero: fields.slug({
    name: { label: "Número", description: 'Ex: "001-2024"' },
  }),

  /** Data de publicação do documento. Padrão: hoje. */
  data: fields.date({
    label: "Data",
    defaultValue: { kind: "today" },
    validation: { isRequired: true },
  }),

  /**
   * Ementa — descrição resumida do assunto do documento.
   * É o campo central para pesquisa.
   */
  ementa: fields.text({
    label: "Assunto / Ementa",
    multiline: true,
    validation: { isRequired: true },
  }),

  /**
   * Arquivo para download (PDF ou DOCX).
   * Armazenado em public/uploads/legislacao/.
   * O publicPath define a URL pública para o arquivo.
   */
  arquivo: fields.file({
    label: "Arquivo (PDF / DOCX)",
    directory: "public/uploads/legislacao",
    publicPath: "/uploads/legislacao/",
    description: "Formatos aceitos: PDF, DOCX. Opcional.",
  }),
} as const;

// ──────────────────────────────────────────
// Configuração principal do Keystatic CMS.
//
// `storage: { kind: "local" }` → lê/escreve arquivos
// diretamente no sistema de arquivos local.
// Em produção (Passo 7), será alterado para
// `{ kind: "github", ... }` para usar o GitHub como backend.
// ──────────────────────────────────────────
export default config({
  storage: {
    kind: "local",
  },

  /** Identidade visual do painel de administração. */
  ui: {
    brand: {
      name: "Prefeitura LARP",
    },
  },

  collections: {
    // ────────────────────────────────────────
    // NOTÍCIAS
    // Armazenadas como arquivos .mdoc (Markdoc)
    // com frontmatter YAML + corpo em rich text.
    // ────────────────────────────────────────
    noticias: collection({
      label: "Notícias",
      slugField: "titulo",
      path: "src/content/noticias/*",
      // `contentField` define qual campo é o corpo do arquivo .mdoc.
      // Os demais campos ficam no frontmatter.
      format: { contentField: "conteudo" },
      schema: {
        /** Título da notícia. Também gera o slug/URL automaticamente. */
        titulo: fields.slug({
          name: {
            label: "Título",
            description: "Título completo da notícia.",
          },
        }),

        /** Data de publicação. Padrão: hoje. */
        data: fields.date({
          label: "Data de Publicação",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),

        /**
         * Resumo curto da notícia — exibido nos cards da homepage
         * e na listagem de notícias. Máximo 500 caracteres.
         */
        ementa: fields.text({
          label: "Ementa / Resumo",
          multiline: true,
          validation: { isRequired: true, length: { max: 500 } },
          description: "Resumo curto exibido nos cards (máx. 500 caracteres).",
        }),

        /**
         * Foto de capa — opcional.
         * Armazenada em public/uploads/noticias/.
         */
        foto: fields.image({
          label: "Foto de Capa",
          directory: "public/uploads/noticias",
          publicPath: "/uploads/noticias/",
          description:
            "Opcional. Tamanho recomendado: 1200×630px.",
        }),

        /**
         * Corpo da notícia em rich text (Markdoc).
         * Suporta formatação, divisores, links e imagens inline.
         */
        conteudo: fields.document({
          label: "Conteúdo",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/uploads/noticias/conteudo",
            publicPath: "/uploads/noticias/conteudo/",
          },
        }),
      },
    }),

    // ────────────────────────────────────────
    // PORTARIAS
    // ────────────────────────────────────────
    portarias: collection({
      label: "Portarias",
      slugField: "numero",
      path: "src/content/portarias/*",
      schema: legislacaoSchema,
    }),

    // ────────────────────────────────────────
    // DECRETOS
    // ────────────────────────────────────────
    decretos: collection({
      label: "Decretos",
      slugField: "numero",
      path: "src/content/decretos/*",
      schema: legislacaoSchema,
    }),

    // ────────────────────────────────────────
    // LEIS
    // ────────────────────────────────────────
    leis: collection({
      label: "Leis",
      slugField: "numero",
      path: "src/content/leis/*",
      schema: legislacaoSchema,
    }),
  },
});
