import React from "react";
import { DocumentRenderer, type DocumentRendererProps } from "@keystatic/core/renderer";

interface DocumentContentProps {
  /** Árvore AST de nós do documento Markdoc retornada pelo Keystatic reader. */
  document: DocumentRendererProps["document"];
}

/**
 * @component DocumentContent
 * @description Componente React para renderizar o rich-text (Markdoc) gerado pelo Keystatic CMS.
 *
 * Utiliza o DocumentRenderer oficial do Keystatic encapsulado na classe `.prose` do Tailwind,
 * garantindo tipografia legível para parágrafos, listas, títulos e citações.
 */
export default function DocumentContent({ document }: DocumentContentProps) {
  if (!document || !Array.isArray(document) || document.length === 0) {
    return <p className="text-[var(--color-text-muted)] italic">Conteúdo textual não disponível.</p>;
  }

  return (
    <div className="prose max-w-none text-[var(--color-text)]">
      <DocumentRenderer document={document} />
    </div>
  );
}
