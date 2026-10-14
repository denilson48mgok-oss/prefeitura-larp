/**
 * @file reader.ts
 * @description Singleton do leitor de conteúdo do Keystatic.
 *
 * O `createReader` cria uma instância que lê o conteúdo das collections
 * diretamente do sistema de arquivos (modo local) ou via GitHub API
 * (modo produção), de acordo com a configuração em keystatic.config.ts.
 *
 * **Por que singleton?**
 * Garante que apenas uma instância do reader é criada por processo,
 * evitando leituras redundantes do sistema de arquivos em builds do Astro.
 *
 * **Uso em páginas Astro:**
 * ```ts
 * import { reader } from "@/lib/reader";
 *
 * // Busca todas as notícias
 * const noticias = await reader.collections.noticias.all();
 *
 * // Busca uma notícia pelo slug
 * const noticia = await reader.collections.noticias.read("minha-noticia");
 * ```
 */

import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

/**
 * Instância do reader do Keystatic.
 *
 * @returns Reader tipado com base no schema definido em keystatic.config.ts.
 *          Todos os métodos são assíncronos e retornam `null` quando
 *          o item não é encontrado.
 */
export const reader = createReader(process.cwd(), keystaticConfig);
