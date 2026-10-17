# `server/` — API e persistência

Backend Express com SQLite. Em desenvolvimento, o front consome `/api` via proxy do Vite.

## Arquivos nesta pasta

| Arquivo | Função |
|---------|--------|
| `tsconfig.json` | TypeScript do servidor (Node, ESM, `noEmit` com `tsx`). |
| `README.md` | Este inventário. |

## Subpastas

| Pasta | Função |
|-------|--------|
| `src/` | Código da API. Ver [src/README.md](src/README.md). |
| `data/` | Banco SQLite local (`academia-devfullstack.db`, gerado; `.gitkeep` versionado). |

## Variáveis de ambiente

Ver `.env.example` na raiz:

- `PORT` — porta HTTP da API (padrão 4000).
- `ACADEMIA_DEVFULLSTACK_DB` — caminho do arquivo SQLite.
- `ACADEMIA_DEVFULLSTACK_SECRET` — segredo para tokens de sessão.

## Scripts

- `npm run dev:server` — `tsx watch server/src/index.ts`
- `npm run start:server` — execução única (usado pelo Playwright)
