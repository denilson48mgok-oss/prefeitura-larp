/**
 * @file content.ts
 * @description Camada de acesso a dados (Data Access Layer) sobre o Keystatic reader.
 *
 * Centraliza todas as consultas de conteúdo (notícias e atos oficiais), garantindo
 * ordenação consistente, tipagem rigorosa e tratamento de valores nulos ou vazios.
 */

import { reader } from "./reader";
import type { Noticia, ItemLegislacao, TipoLegislacao } from "./types";

/**
 * Recupera todas as notícias cadastradas no CMS, ordenadas por data decrescente
 * (as mais recentes aparecem primeiro).
 *
 * @returns Lista tipada de Noticia[] com metadados e slug para roteamento.
 */
export async function getNoticias(): Promise<Noticia[]> {
  try {
    const rawNoticias = await reader.collections.noticias.all();

    const formatadas: Noticia[] = rawNoticias.map((item) => ({
      slug: item.slug,
      titulo: item.entry.titulo,
      data: item.entry.data,
      ementa: item.entry.ementa,
      foto: item.entry.foto ?? null,
    }));

    // Ordenação decrescente: do mais novo para o mais antigo
    return formatadas.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return dataB - dataA;
    });
  } catch (error) {
    console.error("[getNoticias] Erro ao carregar notícias do Keystatic:", error);
    return [];
  }
}

/**
 * Recupera uma única notícia pelo seu slug.
 *
 * @param slug - Identificador da notícia (ex: 'anuncio-dos-jogos-reais').
 * @returns Os dados brutos da notícia incluindo a função `entry.conteudo()` ou null caso não exista.
 */
export async function getNoticiaBySlug(slug: string) {
  try {
    const entry = await reader.collections.noticias.read(slug);
    if (!entry) return null;
    return { slug, entry };
  } catch (error) {
    console.error(`[getNoticiaBySlug] Erro ao buscar notícia slug '${slug}':`, error);
    return null;
  }
}

/**
 * Recupera todos os itens de legislação de uma categoria específica (portarias, decretos ou leis).
 *
 * @param tipo - A categoria legislativa desejada ('portaria' | 'decreto' | 'lei').
 * @returns Lista normalizada de ItemLegislacao[] para a categoria informada.
 */
async function getColecaoLegislacao(tipo: TipoLegislacao): Promise<ItemLegislacao[]> {
  const collectionName = tipo === "portaria" ? "portarias" : tipo === "decreto" ? "decretos" : "leis";

  // @ts-expect-error O reader possui chave indexável dinamicamente baseada em coleções
  const rawItems = await reader.collections[collectionName].all();

  return rawItems.map((item: any) => ({
    slug: item.slug,
    numero: item.entry.numero,
    tipo,
    data: item.entry.data,
    ementa: item.entry.ementa,
    arquivo: item.entry.arquivo ?? null,
  }));
}

/**
 * Recupera e consolida todas as normas (Portarias, Decretos e Leis) em uma única
 * lista padronizada, ordenada por data de publicação decrescente.
 *
 * @returns Lista unificada contendo todos os atos oficiais cadastrados.
 */
export async function getLegislacao(): Promise<ItemLegislacao[]> {
  try {
    const [portarias, decretos, leis] = await Promise.all([
      getColecaoLegislacao("portaria"),
      getColecaoLegislacao("decreto"),
      getColecaoLegislacao("lei"),
    ]);

    const consolidado = [...portarias, ...decretos, ...leis];

    // Ordenação decrescente pela data de publicação
    return consolidado.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return dataB - dataA;
    });
  } catch (error) {
    console.error("[getLegislacao] Erro ao buscar atos legislativos do Keystatic:", error);
    return [];
  }
}

/**
 * Recupera os atos legislativos mais recentes para exibição resumida na homepage.
 *
 * @param limite - Quantidade máxima de registros a retornar (default: 4).
 * @returns Lista resumida dos atos mais recentes.
 */
export async function getLegislacaoRecente(limite: number = 4): Promise<ItemLegislacao[]> {
  const todos = await getLegislacao();
  return todos.slice(0, limite);
}

/**
 * Recupera um ato legislativo específico pelo seu slug.
 *
 * Busca de maneira concorrente nas três coleções (portarias, decretos e leis)
 * retornando o registro correspondente tipado com o campo `tipo`.
 *
 * @param slug - Slug do documento cadastrado no CMS (ex: '001-2025' ou '1-234-2026').
 * @returns ItemLegislacao ou null caso não seja localizado em nenhuma coleção.
 */
export async function getLegislacaoItemBySlug(slug: string): Promise<ItemLegislacao | null> {
  const todos = await getLegislacao();
  const encontrado = todos.find((item) => item.slug === slug);
  return encontrado ?? null;
}
