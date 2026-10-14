/**
 * @file utils.ts
 * @description Funções utilitárias puras para formatação de dados e texto.
 *
 * Todas as funções são rigorosamente tipadas e acompanhadas de comentários
 * demonstrando seus parâmetros, comportamento e retornos esperados.
 */

/**
 * Formata uma string de data no formato ISO (ex: "2026-10-13") para o formato legível em português.
 *
 * @param dataISO - Data no formato YYYY-MM-DD ou formato ISO aceito pelo Date constructor.
 * @param formato - Tipo de formatação desejada:
 *                  - 'longo': "13 de outubro de 2026"
 *                  - 'curto': "13/10/2026"
 * @returns String formatada segundo os padrões da língua portuguesa (pt-BR).
 *
 * @example
 * ```ts
 * formatarData("2026-10-13"); // "13 de outubro de 2026"
 * formatarData("2026-10-13", "curto"); // "13/10/2026"
 * ```
 */
export function formatarData(
  dataISO: string | null | undefined,
  formato: "longo" | "curto" = "longo"
): string {
  if (!dataISO) return "Data não informada";

  // Divide para evitar discrepâncias de fuso horário causadas pelo new Date("YYYY-MM-DD")
  const partes = dataISO.split("-");
  let data: Date;

  if (partes.length === 3) {
    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const dia = parseInt(partes[2], 10);
    data = new Date(ano, mes, dia);
  } else {
    data = new Date(dataISO);
  }

  if (isNaN(data.getTime())) {
    return "Data inválida";
  }

  if (formato === "curto") {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data);
}

/**
 * Trunca uma string de texto ao atingir um comprimento máximo, acrescentando reticências.
 *
 * @param texto - Conteúdo original a ser avaliado.
 * @param limite - Quantidade máxima de caracteres permitida antes do truncamento.
 * @returns Texto limitado com reticências '...' ao final caso ultrapasse o limite.
 *
 * @example
 * ```ts
 * truncarTexto("Abertura das inscrições para o evento cultural", 25);
 * // "Abertura das inscriçõ..."
 * ```
 */
export function truncarTexto(texto: string, limite: number): string {
  if (!texto) return "";
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite).trimEnd() + "...";
}
