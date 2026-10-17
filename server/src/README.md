# `server/src/` — módulos da API

| Arquivo | Função |
|---------|--------|
| `index.ts` | App Express: middleware, rotas REST, tratamento de erros, `listen`. |
| `db.ts` | SQLite: schema, seeds, queries (alunos, trilhas, exercícios, sessões). |
| `auth.ts` | Hash de senha, JWT (ou token) de sessão, verificação. |
| `validate.ts` | Validação de payloads (cadastro, login, sala de estudo). |
| `grade.ts` | Correção de respostas de exercícios. |
| `http.ts` | Utilitários HTTP (`HttpError`, parâmetros de rota). |
| `catalog.ts` | Conteúdo estático: exercícios, ferramentas, citações. |
| `tracks.ts` | Definição das trilhas MERN, MEAN, LAMP, .NET. |
| `types.ts` | Tipos compartilhados do domínio no servidor. |

## Ordem de leitura sugerida

1. `types.ts` — modelo de domínio  
2. `tracks.ts` + `catalog.ts` — conteúdo  
3. `db.ts` — persistência  
4. `index.ts` — superfície HTTP
