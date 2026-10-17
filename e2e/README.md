# `e2e/` — testes end-to-end (Playwright)

Testes de qualidade que exercitam interface + API reais (servidores sobem via `webServer` na config).

## Arquivos

| Arquivo | Função |
|---------|--------|
| `playwright.config.ts` | Configuração Playwright: `baseURL`, servidores, Chromium, timeouts. |
| `portal.spec.ts` | SEO, acessibilidade estrutural, responsividade, fluxos de cadastro e exercício. |
| `README.md` | Este inventário. |

## Execução

```bash
npm run test:e2e
```

Equivalente a:

```bash
playwright test --config e2e/playwright.config.ts
```

## Artefatos gerados (raiz do repo, ignorados pelo Git)

- `test-results/`
- `playwright-report/`
