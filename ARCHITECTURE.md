# Browser Capture CLI - Arquitetura

## Visão Geral

CLI de automação de browser para crawling, screenshots, vídeos e PDFs usando TypeScript e Puppeteer.

## Estrutura do Projeto

```
browser-capture-cli/
├── src/
│   ├── cli/              # Comandos CLI
│   ├── core/             # Lógica de negócio
│   ├── config/           # Configurações
│   ├── types/            # Definições TypeScript
│   └── utils/            # Funções utilitárias
├── output/               # Outputs gerados
│   ├── screenshots/
│   ├── videos/
│   └── pdfs/
└── data/                 # Arquivos de dados
    └── urls.txt
```

## Módulos Principais

### CLI (`src/cli/`)
- Parseia argumentos de linha de comando
- Orquestra funcionalidades core
- Arquivos: `crawl.ts`, `capture.ts`, `record.ts`, `pdf.ts`

### Core (`src/core/`)
- Lógica de negócio independente do CLI
- Gerencia browser, páginas, crawling, screenshots, vídeos, PDFs
- Arquivos: `browser.ts`, `page-setup.ts`, `crawler.ts`, `screenshot.ts`, `recorder.ts`, `pdf.ts`

### Config (`src/config/`)
- Configurações centralizadas
- Sites, viewports, valores padrão

### Utils (`src/utils/`)
- Operações reutilizáveis
- File system, URLs, logging, cleanup

## Fluxo de Dados

1. **Crawl**: Input → Config → Browser → Extrair Links → Salvar URLs
2. **Capture**: Input → URLs → Browser → Screenshot por URL/Viewport → Salvar
3. **Record**: Input → URLs → Browser → Scroll → Frames → FFmpeg → Vídeo
4. **PDF**: Input → URLs → Browser → Gerar PDF → Salvar

## Princípios de Design

- **Separação clara**: CLI, Core, Utils isolados
- **Type-safe**: TypeScript estrito
- **Modular**: Uma responsabilidade por módulo
- **Explícito**: Sem valores mágicos

## Extensões

### Adicionar comando
1. Criar arquivo em `src/cli/`
2. Implementar lógica em `src/core/`
3. Atualizar `src/index.ts`

### Adicionar site
Editar `src/config/sites.ts`

### Adicionar viewport
Editar `src/config/viewports.ts`

## Dependências

- **Produção**: puppeteer
- **Dev**: typescript, eslint, prettier
- **Externa**: ffmpeg (apenas para vídeos)

## Build

```bash
npm run dev      # Desenvolvimento
npm run build    # Produção
npm run lint     # Linting
npm run format   # Formatação
```
