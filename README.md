# Academia DEVFullStack — portal de estudos Full Stack

Portal para estudar do iniciante ao avançado, unindo interface, API e banco. Stack: **React + TypeScript**, **Node.js (Express)** e **SQLite**.

## Início rápido

```bash
npm install
npx playwright install chromium
npm run dev
```

- Interface: http://127.0.0.1:5173 (Vite usa `index.vite.html` em desenvolvimento)
- API: http://127.0.0.1:4000/api/health

### Abrir com Live Server (VS Code)

O `index.html` na raiz é a versão pronta para o Live Server (HTML + JS já compilados).

1. Gere ou atualize o site: `npm run build:site`
2. Em outro terminal, suba a API: `npm run start:server`
3. Clique em **Go Live** no `index.html` (porta padrão 5500)

A interface chama a API em `http://127.0.0.1:4000`. Sem a API rodando, cadastro e exercícios não carregam dados.

## Qualidade

```bash
npm run typecheck
npm run test:e2e
```

## Estrutura do projeto

A organização de pastas, inventário de arquivos e convenções estão em **[docs/ORGANIZACAO.md](docs/ORGANIZACAO.md)**.
