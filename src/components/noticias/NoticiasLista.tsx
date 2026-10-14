import React, { useState, useMemo } from "react";
import type { Noticia } from "@/lib/types";

interface NoticiasListaProps {
  /** Coleção inicial de notícias carregadas pelo Astro em tempo de compilação. */
  noticiasIniciais: Noticia[];
}

/**
 * @component NoticiasLista
 * @description Componente interativo para listagem, busca e filtragem em tempo real de notícias.
 *
 * Oferece busca instantânea no lado do cliente por título e ementa, além de
 * ordenação cronológica e contagem dinâmica de correspondências.
 */
export default function NoticiasLista({ noticiasIniciais }: NoticiasListaProps) {
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<"recentes" | "antigas">("recentes");

  // Filtra e ordena a coleção sem refazer cálculos desnecessários
  const noticiasFiltradas = useMemo(() => {
    let resultado = [...noticiasIniciais];

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      resultado = resultado.filter(
        (n) =>
          n.titulo.toLowerCase().includes(termo) ||
          n.ementa.toLowerCase().includes(termo)
      );
    }

    resultado.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return ordem === "recentes" ? dataB - dataA : dataA - dataB;
    });

    return resultado;
  }, [noticiasIniciais, busca, ordem]);

  return (
    <div className="space-y-6">
      {/* ──────────────────────────────────────────
          BARRA DE FERRAMENTAS: BUSCA & ORDENAÇÃO
      ────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Campo de Busca */}
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
            🔍
          </span>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por título ou assunto da notícia..."
            aria-label="Pesquisar notícias"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary-DEFAULT)] transition-colors"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
              aria-label="Limpar pesquisa"
            >
              ✕
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label htmlFor="ordem-noticias" className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
            Ordenar por:
          </label>
          <select
            id="ordem-noticias"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as "recentes" | "antigas")}
            className="px-3 py-2 text-xs rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary-DEFAULT)] cursor-pointer"
          >
            <option value="recentes">Mais recentes primeiro</option>
            <option value="antigas">Mais antigas primeiro</option>
          </select>
        </div>
      </div>

      {/* Indicador de Quantidade */}
      <div className="text-xs text-[var(--color-text-muted)] flex justify-between items-center px-1">
        <span>
          Exibindo <strong>{noticiasFiltradas.length}</strong> de{" "}
          <strong>{noticiasIniciais.length}</strong> notícias cadastradas
        </span>
        {busca && (
          <button
            onClick={() => setBusca("")}
            className="text-[var(--color-primary-DEFAULT)] hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* ──────────────────────────────────────────
          GRID DE RESULTADOS
      ────────────────────────────────────────── */}
      {noticiasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticiasFiltradas.map((noticia) => (
            <a
              key={noticia.slug}
              href={`/noticias/${noticia.slug}`}
              className="group flex flex-col h-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary-DEFAULT)] transition-all duration-200 overflow-hidden transform hover:-translate-y-1 shadow-sm"
            >
              {/* Imagem de Capa */}
              <div className="relative w-full h-48 bg-[var(--color-surface-2)] overflow-hidden border-b border-[var(--color-border)]">
                {noticia.foto ? (
                  <img
                    src={noticia.foto}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-muted)]">
                    <span className="text-3xl mb-1">📰</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Prefeitura LARP</span>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--color-primary-DEFAULT)]">
                    📅 {noticia.data}
                  </span>
                  <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary-light)] transition-colors line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
                    {noticia.ementa}
                  </p>
                </div>

                <div className="pt-2 text-xs font-bold text-[var(--color-primary-DEFAULT)] group-hover:translate-x-1 transition-transform flex items-center">
                  <span>Acessar notícia</span>
                  <span className="ml-1">&rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <span className="text-4xl block">🔎</span>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Nenhuma notícia encontrada para "{busca}"
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
            Tente buscar por termos mais genéricos ou confira a grafia das palavras.
          </p>
          <button
            onClick={() => setBusca("")}
            className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--color-primary-DEFAULT)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Ver todas as notícias
          </button>
        </div>
      )}
    </div>
  );
}
