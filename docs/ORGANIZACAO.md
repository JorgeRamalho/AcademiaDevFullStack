# Organização do repositório — Academia DEVFullStack

Este documento define o padrão de pastas, o que permanece na raiz e onde encontrar cada responsabilidade do monólito full stack.

## Princípios

1. **Raiz enxuta** — apenas entrada da aplicação web, manifesto do Node/npm e configuração mínima compartilhada.
2. **Separação clara** — `client/` (interface), `server/` (API e persistência), `e2e/` (qualidade automatizada), `docs/` (referência).
3. **Documentação por pasta** — cada diretório principal possui `README.md` com inventário de arquivos e papel de cada um.
4. **Um único ponto de entrada HTML** — `index.html` na raiz, servido pelo Vite com `root` no repositório.

## Árvore de alto nível

```text
Projeto-FullStack/
├── index.html              # Entrada HTML (SEO, #root, script do client)
├── package.json            # Scripts e dependências do monólito
├── package-lock.json       # Lockfile npm
├── vite.config.ts          # Dev server e build do front (proxy /api)
├── .env.example            # Variáveis de ambiente documentadas
├── .gitignore
├── README.md               # Início rápido (link para esta doc)
├── client/                 # Código-fonte React + TypeScript
├── server/                 # API Express + SQLite
├── e2e/                    # Playwright (testes + config)
├── docs/                   # Documentação de estrutura e processo
├── dist-client/            # Build de produção do front (gerado)
└── node_modules/           # Dependências (gerado)
```

## Fluxo de desenvolvimento

| Comando | Efeito |
|--------|--------|
| `npm run dev` | API (`server/`) + Vite na raiz (`index.html` → `client/src`) |
| `npm run dev:client` | Somente Vite |
| `npm run dev:server` | Somente API com reload |
| `npm run typecheck` | TypeScript em `server/` e `client/` |
| `npm run test:e2e` | Playwright (`e2e/playwright.config.ts`) |

## Portas padrão

- Interface: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:4000/api/health`

## Onde não colocar coisas novas

| Evitar na raiz | Colocar em |
|----------------|------------|
| Componentes React | `client/src/components/` |
| Páginas / rotas | `client/src/pages/` |
| Rotas HTTP | `server/src/index.ts` ou módulos em `server/src/` |
| Testes E2E | `e2e/*.spec.ts` |
| Conteúdo pedagógico estático da API | `server/src/catalog.ts`, `tracks.ts` |
| Banco de dados local | `server/data/` (arquivo `.db` ignorado pelo Git) |

## Documentação por pasta

| Pasta | README |
|-------|--------|
| `client/` | [../client/README.md](../client/README.md) |
| `client/src/` | [../client/src/README.md](../client/src/README.md) |
| `client/src/components/` | [../client/src/components/README.md](../client/src/components/README.md) |
| `client/src/pages/` | [../client/src/pages/README.md](../client/src/pages/README.md) |
| `server/` | [../server/README.md](../server/README.md) |
| `server/src/` | [../server/src/README.md](../server/src/README.md) |
| `e2e/` | [../e2e/README.md](../e2e/README.md) |

## Evolução recomendada

- Novos pacotes compartilhados: pasta `packages/` ou `shared/` (tipos, validação) quando houver duplicação real entre client e server.
- CI: workflows em `.github/workflows/` sem poluir a raiz.
- Configurações adicionais (ESLint, Prettier): pasta `config/` se a raiz crescer demais.
