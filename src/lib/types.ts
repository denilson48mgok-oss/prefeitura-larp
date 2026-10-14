/**
 * @file types.ts
 * @description Tipos TypeScript centrais do projeto Prefeitura LARP.
 *
 * Estes tipos representam as entidades de domínio da aplicação.
 * São usados em componentes, páginas e funções utilitárias.
 *
 * Os tipos de conteúdo (Noticia, ItemLegislacao) são derivados
 * manualmente dos schemas do Keystatic para uso em contextos onde
 * o reader não está disponível (ex: componentes de UI puros).
 */

// ──────────────────────────────────────────
// LEGISLAÇÃO
// ──────────────────────────────────────────

/**
 * Tipo discriminador para os três tipos de documentos legislativos.
 * Corresponde às três collections do Keystatic: portarias, decretos, leis.
 */
export type TipoLegislacao = "portaria" | "decreto" | "lei";

/**
 * Rótulo legível para exibição na UI.
 * Mapeia o valor do enum para o nome completo em português.
 */
export const LABEL_TIPO_LEGISLACAO: Record<TipoLegislacao, string> = {
  portaria: "Portaria",
  decreto: "Decreto",
  lei: "Lei",
} as const;

/**
 * Cor de badge para cada tipo de documento.
 * Usada nos componentes de card e listagem para identificação visual rápida.
 *
 * Os valores são classes CSS custom definidas em global.css.
 */
export const COR_TIPO_LEGISLACAO: Record<TipoLegislacao, string> = {
  portaria: "badge--primary",   // laranja
  decreto:  "badge--secondary", // vermelho
  lei:      "badge--neutral",   // cinza
} as const;

// ──────────────────────────────────────────
// NOTÍCIA
// ──────────────────────────────────────────

/**
 * Representa uma notícia completa com seu slug e todos os campos.
 *
 * `foto` e `conteudo` são opcionais porque podem não estar presentes
 * em todas as entradas (foto é opcional no CMS; conteudo pode ser nulo
 * em entradas incompletas).
 */
export interface Noticia {
  /** Identificador único na URL. Gerado a partir do título. */
  slug: string;
  /** Título completo da notícia. */
  titulo: string;
  /** Data de publicação no formato ISO 8601 (YYYY-MM-DD). */
  data: string;
  /** Resumo curto para exibição em cards e listagens. */
  ementa: string;
  /** Caminho público da foto de capa. Ex: /uploads/noticias/foto.jpg */
  foto?: string | null;
}

// ──────────────────────────────────────────
// LEGISLAÇÃO — ITEM UNIFICADO
// ──────────────────────────────────────────

/**
 * Representa um item de legislação (portaria, decreto ou lei)
 * normalizado para exibição unificada na listagem e nos cards.
 *
 * O campo `tipo` é adicionado programaticamente ao buscar os dados,
 * já que cada tipo vem de uma collection separada no Keystatic.
 */
export interface ItemLegislacao {
  /** Identificador único na URL. Gerado a partir do número. */
  slug: string;
  /** Número do documento. Ex: "001/2024" */
  numero: string;
  /** Tipo do documento — determina a collection de origem. */
  tipo: TipoLegislacao;
  /** Data de publicação no formato ISO 8601 (YYYY-MM-DD). */
  data: string;
  /** Descrição do assunto do documento. Campo principal de busca. */
  ementa: string;
  /** Caminho público do arquivo para download. Ex: /uploads/legislacao/portaria.pdf */
  arquivo?: string | null;
}

// ──────────────────────────────────────────
// UTILITÁRIOS
// ──────────────────────────────────────────

/**
 * Opções de filtro para a listagem de legislação.
 * `undefined` significa "todos" (sem filtro aplicado).
 */
export interface FiltroLegislacao {
  tipo?: TipoLegislacao;
  /** Data inicial do período (YYYY-MM-DD). */
  dataInicio?: string;
  /** Data final do período (YYYY-MM-DD). */
  dataFim?: string;
  /** Termo de busca livre — pesquisado no número e na ementa. */
  busca?: string;
}
