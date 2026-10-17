# `client/` — interface (React)

Código-fonte do front-end. O HTML de entrada fica na **raiz do repositório** (`index.html`); esta pasta contém apenas TypeScript, estilos e configuração do compilador do client.

## Arquivos nesta pasta

| Arquivo | Função |
|---------|--------|
| `tsconfig.json` | Opções do TypeScript para `src/` (strict, JSX, DOM). |
| `README.md` | Este inventário. |

## Subpastas

| Pasta | Conteúdo |
|-------|----------|
| `src/` | Aplicação React (rotas, páginas, componentes, API client). Ver [src/README.md](src/README.md). |

## Scripts relacionados

- `npm run dev:client` — Vite com `root` na raiz do repo; resolve `/client/src/*`.
- `npm run typecheck` — inclui `tsc -p client/tsconfig.json`.
