# `client/src/` — núcleo da aplicação React

## Arquivos na raiz de `src/`

| Arquivo | Função |
|---------|--------|
| `main.tsx` | Monta a árvore React em `#root`; importa fontes e `styles.css`. |
| `App.tsx` | Definição de rotas (`react-router-dom`) e layout geral. |
| `auth.tsx` | Contexto de autenticação (token, login/logout, usuário). |
| `api.ts` | Cliente HTTP para endpoints `/api/*`. |
| `hooks.ts` | Hooks reutilizáveis (dados, loading, erros). |
| `types.ts` | Tipos TypeScript alinhados aos contratos da API. |
| `labels.ts` | Textos e rótulos de UI (pilares, níveis, copy). |
| `styles.css` | Design system global (tokens, layout, componentes base). |
| `vite-env.d.ts` | Tipos do Vite (`import.meta.env`). |

## Subpastas

| Pasta | Documentação |
|-------|----------------|
| `components/` | [components/README.md](components/README.md) |
| `pages/` | [pages/README.md](pages/README.md) |

## Convenções

- Páginas em `pages/` correspondem a rotas em `App.tsx`.
- Chamadas à API passam por `api.ts`; não duplicar URLs em vários arquivos.
- Estado de sessão do aluno: `auth.tsx`.
