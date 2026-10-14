import React, { useState, useMemo } from "react";
import type { ItemLegislacao, TipoLegislacao } from "@/lib/types";

interface LegislacaoFiltroProps {
  /** Coleção consolidada de atos oficiais gerada pelo Astro em tempo de build. */
  itensIniciais: ItemLegislacao[];
}

/**
 * Mapeamento de rótulos e estilos de badge para os tipos de documentos.
 */
const CONFIG_TIPOS: Record<
  TipoLegislacao,
  { label: string; badgeClass: string; icon: string }
> = {
  portaria: {
    label: "Portaria",
    badgeClass: "badge--primary",
    icon: "📋",
  },
  decreto: {
    label: "Decreto",
    badgeClass: "badge--secondary",
    icon: "📜",
  },
  lei: {
    label: "Lei Municipal",
    badgeClass: "badge--neutral",
    icon: "⚖️",
  },
};

/**
 * @component LegislacaoFiltro
 * @description Mecanismo interativo de pesquisa e filtros para Atos Oficiais.
 *
 * Atende aos requisitos de consulta da administração pública:
 * 1. Pesquisa textual por número do ato ou termos da ementa.
 * 2. Filtro por categoria (Portaria, Decreto ou Lei).
 * 3. Filtro por período de publicação (data inicial e data final).
 * 4. Limpeza rápida de parâmetros de busca.
 */
export default function LegislacaoFiltro({ itensIniciais }: LegislacaoFiltroProps) {
  const [tipoSelecionado, setTipoSelecionado] = useState<"todos" | TipoLegislacao>("todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  // Aplica todos os filtros de forma combinada e reativa
  const itensFiltrados = useMemo(() => {
    return itensIniciais.filter((item) => {
      // 1. Filtro por tipo
      if (tipoSelecionado !== "todos" && item.tipo !== tipoSelecionado) {
        return false;
      }

      // 2. Filtro por texto (número ou ementa)
      if (termoBusca.trim()) {
        const termo = termoBusca.toLowerCase().trim();
        const noNumero = item.numero.toLowerCase().includes(termo);
        const naEmenta = item.ementa.toLowerCase().includes(termo);
        if (!noNumero && !naEmenta) return false;
      }

      // 3. Filtro por período (data inicial)
      if (dataInicio && item.data < dataInicio) {
        return false;
      }

      // 4. Filtro por período (data final)
      if (dataFim && item.data > dataFim) {
        return false;
      }

      return true;
    });
  }, [itensIniciais, tipoSelecionado, termoBusca, dataInicio, dataFim]);

  const temFiltroAtivo =
    tipoSelecionado !== "todos" ||
    termoBusca.trim() !== "" ||
    dataInicio !== "" ||
    dataFim !== "";

  const limparFiltros = () => {
    setTipoSelecionado("todos");
    setTermoBusca("");
    setDataInicio("");
    setDataFim("");
  };

  // Contadores por categoria
  const contadores = useMemo(() => {
    return {
      todos: itensIniciais.length,
      portaria: itensIniciais.filter((i) => i.tipo === "portaria").length,
      decreto: itensIniciais.filter((i) => i.tipo === "decreto").length,
      lei: itensIniciais.filter((i) => i.tipo === "lei").length,
    };
  }, [itensIniciais]);

  return (
    <div className="space-y-6">
      {/* ──────────────────────────────────────────
          PAINEL DE CONTROLE DE FILTROS
      ────────────────────────────────────────── */}
      <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        {/* Abas de Categoria */}
        <div className="flex items-center gap-2 flex-wrap border-b border-[var(--color-border)] pb-4">
          <span className="text-xs font-semibold text-[var(--color-text-muted)] mr-1">
            Categoria:
          </span>

          <button
            onClick={() => setTipoSelecionado("todos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tipoSelecionado === "todos"
                ? "bg-[var(--color-primary-DEFAULT)] text-white shadow-sm"
                : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Todos os Atos ({contadores.todos})
          </button>

          <button
            onClick={() => setTipoSelecionado("portaria")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tipoSelecionado === "portaria"
                ? "bg-[var(--color-primary-DEFAULT)] text-white shadow-sm"
                : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Portarias ({contadores.portaria})
          </button>

          <button
            onClick={() => setTipoSelecionado("decreto")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tipoSelecionado === "decreto"
                ? "bg-[var(--color-secondary-DEFAULT)] text-white shadow-sm"
                : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Decretos ({contadores.decreto})
          </button>

          <button
            onClick={() => setTipoSelecionado("lei")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tipoSelecionado === "lei"
                ? "bg-stone-600 text-white shadow-sm"
                : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Leis ({contadores.lei})
          </button>
        </div>

        {/* Linha Principal de Busca */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
              🔍
            </span>
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Pesquisar por número do ato ou termos da ementa..."
              aria-label="Pesquisar atos normativos"
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary-DEFAULT)] transition-colors"
            />
            {termoBusca && (
              <button
                onClick={() => setTermoBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
                aria-label="Limpar termo de busca"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
            className="px-4 py-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>📅 Filtrar por Período</span>
            <span>{mostrarFiltrosAvancados ? "▲" : "▼"}</span>
          </button>

          {temFiltroAtivo && (
            <button
              type="button"
              onClick={limparFiltros}
              className="px-3 py-2 text-xs font-bold text-[var(--color-primary-light)] hover:underline whitespace-nowrap text-center"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Filtros de Período (Data Inicial e Final) */}
        {mostrarFiltrosAvancados && (
          <div className="pt-3 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--color-surface-2)] p-4 rounded-lg">
            <div>
              <label htmlFor="data-inicio" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                Data Inicial:
              </label>
              <input
                id="data-inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[var(--color-base)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary-DEFAULT)]"
              />
            </div>

            <div>
              <label htmlFor="data-fim" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                Data Final:
              </label>
              <input
                id="data-fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-[var(--color-base)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary-DEFAULT)]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Indicador de Resultados */}
      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] px-1">
        <span>
          Encontrados <strong>{itensFiltrados.length}</strong> atos normativos de{" "}
          <strong>{itensIniciais.length}</strong> cadastrados
        </span>
      </div>

      {/* ──────────────────────────────────────────
          LISTA DE DOCUMENTOS
      ────────────────────────────────────────── */}
      {itensFiltrados.length > 0 ? (
        <div className="space-y-4">
          {itensFiltrados.map((item) => {
            const config = CONFIG_TIPOS[item.tipo];
            const extensao = item.arquivo ? item.arquivo.split(".").pop()?.toUpperCase() : null;

            return (
              <div
                key={`${item.tipo}-${item.slug}`}
                className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary-DEFAULT)] transition-colors space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`badge ${config.badgeClass} badge--sm`}>
                      {config.label}
                    </span>
                    <h3 className="font-bold text-[var(--color-text)] font-mono">
                      nº {item.numero}
                    </h3>
                  </div>

                  <time
                    dateTime={item.data}
                    className="text-xs font-medium text-[var(--color-text-muted)]"
                  >
                    Publicado em: {item.data}
                  </time>
                </div>

                {/* Ementa do Documento */}
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item.ementa}
                </p>

                {/* Rodapé do Card com Ações */}
                <div className="pt-2 flex items-center justify-between gap-3 flex-wrap text-xs">
                  {item.arquivo ? (
                    <a
                      href={item.arquivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] font-semibold text-[var(--color-primary-DEFAULT)] hover:text-white hover:bg-[var(--color-primary-DEFAULT)] hover:border-[var(--color-primary-DEFAULT)] transition-colors"
                    >
                      <span>📥 Baixar Documento Oficial ({extensao})</span>
                    </a>
                  ) : (
                    <span className="text-[var(--color-muted)] italic">
                      Arquivo digital não anexado
                    </span>
                  )}

                  <a
                    href={`/legislacao/${item.slug}`}
                    className="font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors ml-auto"
                  >
                    Visualizar ficha do ato &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <span className="text-4xl block">📂</span>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Nenhum ato oficial localizado com os filtros selecionados
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
            Verifique o número pesquisado, amplie o intervalo de datas ou limpe os filtros para visualizar todo o acervo.
          </p>
          <button
            onClick={limparFiltros}
            className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--color-primary-DEFAULT)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Redefinir filtros
          </button>
        </div>
      )}
    </div>
  );
}
