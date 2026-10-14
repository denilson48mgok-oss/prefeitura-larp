# 🏛️ Portal Oficial da Prefeitura LARP

> **Projeto de Demonstração para Implementação Técnica (Analista / Consultor de Implementação)**  
> Portal governamental moderno, performático e seguro, construído com foco em eficiência de custos, transparência pública e padrões rigorosos de engenharia de software.

[![Astro 5](https://img.shields.io/badge/Astro-5.0-orange.svg?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![Keystatic CMS](https://img.shields.io/badge/Keystatic-Git_Based_CMS-purple.svg)](https://keystatic.com)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-black.svg?logo=github)](https://pages.github.com)

---

## 🎯 Visão do Produto & Arquitetura

Este projeto foi desenhado como um **Produto Mínimo Viável (MVP)** de alta escalabilidade para atender demandas de modernização digital do setor público (prefeituras e câmaras municipais).

### Desafios Resolvidos na Implementação
1. **Zero Custo de Servidor (Zero-Ops):** Eliminação de servidores Node/PHP tradicionais e bancos de dados SQL vulneráveis a invasões, operando 100% como Gerador de Sites Estáticos (SSG).
2. **Governança e Trilha de Auditoria Pública:** Todo o conteúdo cadastrado no CMS (notícias e atos oficiais) gera commits versionados no Git, garantindo rastreabilidade inalterável de quem publicou, quando e o que alterou.
3. **Desempenho e Core Web Vitals:** Arquitetura de ilhas (Islands Architecture) do Astro, entregando HTML estático por padrão e hidratando em React apenas componentes interativos de busca.
4. **Safeguards de Acesso:** Painel administrativo (`/keystatic`) protegido no nível de repositório, garantindo que apenas operadores e consultores autorizados publiquem atos oficiais.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Justificativa de Engenharia |
|---|---|---|
| **Framework Core** | **Astro 5** | SSG ultrarrápido, rotas dinâmicas compiladas e integração limpa com TypeScript. |
| **Linguagem** | **TypeScript 5 (Strict)** | Tipagem rigorosa em 100% dos utilitários, entidades de domínio e coleções. |
| **Estilização** | **Tailwind CSS v4** | CSS moderno via `@theme`, tokens nativos institucionais e zero runtime de CSS. |
| **CMS Desacoplado** | **Keystatic CMS** | Interface visual para operadores com persistência local em dev e via GitHub API em produção. |
| **Busca Indexada** | **Pagefind** | Mecanismo de busca estática full-text pós-compilação em português (`pt-BR`). |
| **Hospedagem & CI/CD** | **GitHub Actions + Pages** | Pipeline automatizado de integração contínua e publicação segura em CDN global. |

---

## 📦 Funcionalidades Implementadas

### 1. 📰 Central de Notícias Oficiais
- **Cadastro no CMS:** Título, data de publicação, ementa/lead, foto de capa em alta definição e corpo completo com editor Markdoc (negrito, itálico, listas, citações).
- **Listagem e Busca Reativa:** Busca instantânea por palavras-chave no título e ementa, seletor de ordenação cronológica e contadores de itens.
- **Página do Artigo:** Metadados estruturados, breadcrumbs de acessibilidade, foto ampliada com créditos e matérias recomendadas no rodapé.

### 2. 📜 Repositório de Atos Normativos (Portarias, Decretos e Leis)
- **Cadastro Estruturado:** Número do ato, data de sanção, assunto/ementa oficial e upload de documento digitalizado (`.pdf` ou `.docx`).
- **Mecanismos de Pesquisa e Filtros:**
  - **Pesquisa por Número e Ementa:** Localização instantânea de documentos.
  - **Filtro por Categoria:** Abas exclusivas para *Todas as Normas*, *Portarias*, *Decretos* e *Leis*.
  - **Filtro por Período:** Intervalo delimitado por data inicial e data final.
- **Download Seguro:** Botão de download com identificação dinâmica da extensão do arquivo oficial.
- **Página Detalhada do Ato:** Ficha completa de fé pública do ato com link para visualização e atos correlatos.

### 3. 🏛️ Identidade Visual Institucional & Acessibilidade
- Paleta solene e sóbria voltada à administração pública: Preto base (`#0D0D0D`), Superfície escura (`#1A1A1A`), Laranja institucional (`#E85D04`) e Vermelho executivo (`#9B1B1B`).
- *Skip-link* para salto direto ao conteúdo via navegação por teclado (WCAG).
- Metatags completas de SEO, Open Graph e Twitter Cards para compartilhamento em redes sociais.

---

## 📂 Estrutura Modular do Projeto

```
prefeitura-larp/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Pipeline automatizado de CI/CD para GitHub Pages
├── public/
│   ├── favicon.svg               # Brasão institucional vetorial
│   └── uploads/                  # Mídias e anexos enviados pelo CMS (fotos, PDFs, DOCXs)
├── src/
│   ├── components/
│   │   ├── layout/               # Header, Footer e BaseLayout estruturais
│   │   ├── ui/                   # Badge, Button, Card e DocumentContent (Markdoc)
│   │   ├── noticias/             # NoticiaCard e NoticiasLista interativa
│   │   └── legislacao/           # LegislacaoCard e LegislacaoFiltro reativo
│   ├── content/                  # Dados persistidos em formato plano pelo CMS
│   │   ├── noticias/             # Artigos em formato .mdoc com frontmatter
│   │   ├── portarias/            # Atos em .yaml
│   │   ├── decretos/             # Decretos em .yaml
│   │   └── leis/                 # Leis em .yaml
│   ├── lib/
│   │   ├── reader.ts             # Leitor singleton tipado do Keystatic
│   │   ├── content.ts            # Camada de consultas tipadas (DAL)
│   │   ├── types.ts              # Definições estritas de tipos do domínio
│   │   └── utils.ts              # Utilitários de formatação de data e texto
│   ├── pages/
│   │   ├── index.astro           # Homepage dinâmica
│   │   ├── noticias/
│   │   │   ├── index.astro       # Listagem com busca de notícias
│   │   │   └── [slug].astro      # Artigo jornalístico individual (SSG)
│   │   └── legislacao/
│   │       ├── index.astro       # Listagem de atos com filtros múltiplos
│   │       └── [slug].astro      # Ficha individual da norma com download
│   └── styles/
│       └── global.css            # Tokens de cores Tailwind v4 e estilos BEM
├── keystatic.config.ts           # Definição dos Schemas de coleções do CMS
├── astro.config.mjs              # Configuração Astro (SSG + Tailwind Vite + React)
└── tsconfig.json                 # Configuração TypeScript Strictest
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v18 ou superior instalado.
- Gerenciador de pacotes **npm**.

### 1. Clonar e Instalar
```bash
git clone <url-do-seu-repositorio>
cd Pref-Cam
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
O portal estará disponível em:
- **Site Público:** [http://localhost:4321](http://localhost:4321)
- **Painel Administrativo do CMS:** [http://localhost:4321/keystatic](http://localhost:4321/keystatic)

### 3. Testar Build de Produção e Busca Pagefind
```bash
npm run build
```
O diretório `dist/` será gerado com as páginas compiladas estaticamente e os índices do Pagefind.

---

## 🌐 Publicação no GitHub Pages (Passo a Passo)

Para publicar este projeto online no seu GitHub:

1. **Crie um novo repositório no GitHub** (ex: `prefeitura-larp`).
2. **Inicialize o Git e envie os arquivos:**
   ```bash
   git init
   git add .
   git commit -m "feat: implementacao completa do portal institucional Prefeitura LARP"
   git branch -M main
   git remote add origin https://github.com/<SEU-USUARIO>/<SEU-REPOSITORIO>.git
   git push -u origin main
   ```
3. **Habilitar o GitHub Pages com GitHub Actions:**
   - No GitHub, acesse seu repositório &rarr; **Settings** &rarr; **Pages**.
   - Em **Build and deployment** &rarr; **Source**, selecione: **GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` será disparado automaticamente e publicará o portal em:
   `https://<SEU-USUARIO>.github.io/<SEU-REPOSITORIO>/`

---

## 👨‍💻 Sobre o Projeto & Contato

Projeto desenvolvido com foco em consultoria de implementação, demonstrando competência técnica em:
- Arquitetura de soluções estáticas modernas (JAMstack / SSG);
- Modelagem de conteúdo desacoplado (Headless / Git-based CMS);
- Governança, acessibilidade e padrões de código limpo e escalável.
