# `client/src/pages/` — rotas da interface

Cada arquivo exporta uma página ligada a uma rota em `App.tsx`.

| Arquivo | Rota típica | Função |
|---------|-------------|--------|
| `HomePage.tsx` | `/` | Landing, visão geral e CTA para trilhas. |
| `TracksPage.tsx` | `/trilhas` | Lista de trilhas por pilar. |
| `TrackPage.tsx` | `/trilhas/:slug` | Detalhe de uma trilha e módulos. |
| `ExercisesPage.tsx` | `/exercicios` | Catálogo de exercícios. |
| `ExercisePage.tsx` | `/exercicios/:id` | Execução e envio de resposta. |
| `StudyRoomPage.tsx` | `/sala` | Sala de estudos / foco. |
| `MapPage.tsx` | `/mapa` | Mapa visual do percurso. |
| `DataPage.tsx` | `/dados` | Visão de schema / dados pedagógicos. |
| `RegisterPage.tsx` | `/cadastro` | Inscrição de aluno. |
| `LoginPage.tsx` | `/entrar` | Login. |
| `ProfilePage.tsx` | `/perfil` | Perfil e progresso (autenticado). |
| `NotFoundPage.tsx` | `*` | 404. |
