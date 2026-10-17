import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/trilhas", "/cadastro", "/entrar", "/mapa", "/dados", "/sala", "/exercicios"];

async function overflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe("SEO, estrutura e identidade", () => {
  test("a página inicial declara idioma, título, descrição e dados estruturados", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page).toHaveTitle(/Academia DEVFullStack — Portal de estudos Full Stack/);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /Full Stack/);
    const descriptionText = await description.getAttribute("content");
    expect(descriptionText && descriptionText.length).toBeGreaterThan(80);
    const jsonLd = await page.locator('script[type="application/ld+json"]').innerHTML();
    expect(jsonLd).toContain("MERN");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("tela e o banco");
  });

  test("cada rota principal tem um título, um h1 e os marcos da página", async ({ page }) => {
    for (const path of routes) {
      await page.goto(path);
      await expect(page).toHaveTitle(/Academia DEVFullStack/);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header").first()).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    }
  });

  test("tipografia, cor e colofão sustentam a identidade visual", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const headingFont = await page.locator("h1").evaluate((element) => getComputedStyle(element).fontFamily);
    const bodyFont = await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily);
    const codeFont = await page.locator(".forge-code").evaluate((element) => getComputedStyle(element).fontFamily);
    expect(headingFont.toLowerCase()).toContain("fraunces");
    expect(bodyFont.toLowerCase()).toContain("outfit");
    expect(codeFont.toLowerCase()).toContain("jetbrains mono");

    const button = page.getByRole("link", { name: "Inscrever meu estudo" });
    const colors = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, text: style.color };
    });
    expect(colors.background).not.toBe(colors.text);
    await expect(page.getByText("Composto em Fraunces e Outfit, com código em JetBrains Mono.")).toBeVisible();
  });

  test("o texto corrido tem medida e entrelinha de leitura", async ({ page }) => {
    await page.goto("/");
    const metrics = await page.locator(".hero-copy .deck").evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
      };
    });
    expect(metrics.lineHeight / metrics.fontSize).toBeGreaterThanOrEqual(1.45);
    const size = await page.locator("h1").evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    expect(size).toBeGreaterThanOrEqual(36);
  });
});

test.describe("Usabilidade, layout e responsividade", () => {
  test("o atalho de teclado chega ao conteúdo e o painel do hero troca de camada", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeFocused();
    const front = page.getByRole("tab", { name: "Front-end: Interface" });
    await front.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Back-end: Lógica" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#forge-code")).toContainText("SELECT nome");
  });

  test("links internos têm destino e o formulário explica o que falta", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of hrefs) {
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
    }

    await page.goto("/cadastro");
    await expect(page.getByRole("group", { name: "Seu ponto de partida" })).toBeVisible();
    await expect(page.getByLabel("Nome")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Criar meu cadastro" }).click();
    await expect(page.getByText("Informe seu nome.")).toBeVisible();
    await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
    await expect(page.getByText("Escolha seu nível.")).toBeVisible();
    await expect(page.getByText("Escolha um pilar.")).toBeVisible();
  });

  test("o layout não vaza na horizontal no celular, no tablet e no desktop", async ({ page }) => {
    for (const width of [390, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await overflow(page)).toBeLessThanOrEqual(1);
      await page.goto("/cadastro");
      expect(await overflow(page)).toBeLessThanOrEqual(1);
      await page.goto("/dados");
      await expect(page.getByRole("heading", { name: "Estratégia deste projeto" })).toBeVisible();
      expect(await overflow(page)).toBeLessThanOrEqual(1);
    }
  });

  test("no celular o menu abre e leva a uma trilha", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Trilhas" }).click();
    await expect(page).toHaveURL(/\/trilhas$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Escolha o pilar");
    expect(await overflow(page)).toBeLessThanOrEqual(1);
  });
});

test.describe("Conceitos, API e fluxo de estudo", () => {
  test("o mapa e os dados mostram a estratégia full stack", async ({ page, request }) => {
    const health = await request.get("/api/health");
    expect(health.ok()).toBeTruthy();
    const overview = await request.get("/api/overview");
    const body = (await overview.json()) as { tracks: number; exercises: number; engine: string };
    expect(body.tracks).toBe(4);
    expect(body.exercises).toBeGreaterThanOrEqual(12);
    expect(body.engine).toBe("SQLite");

    await page.goto("/");
    await expect(page.getByText("SQLite").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "MERN" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "MEAN" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "LAMP" })).toBeVisible();
    await expect(page.getByRole("heading", { name: ".NET" })).toBeVisible();

    await page.goto("/mapa");
    for (const name of ["HTML5", "React", "Angular", "Vue.js", "Node.js", "Python", "Java", "PHP", "C#", "PostgreSQL", "MySQL", "MongoDB"]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }

    await page.goto("/dados");
    await expect(page.getByText("password_hash").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "study_sessions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Estratégia deste projeto" })).toBeVisible();
  });

  test("cadastro, exercício e sala funcionam de ponta a ponta", async ({ page }) => {
    const email = `ana.${Date.now()}@academia-devfullstack.dev`;
    await page.goto("/cadastro");
    await page.getByLabel("Nome").fill("Ana Lima");
    await page.getByLabel("E-mail").fill(email);
    await page.getByRole("radio", { name: /Iniciante/ }).check();
    await page.getByRole("radio", { name: /^MERN/ }).check();
    await page.getByLabel("O que você quer construir?").fill("Publicar meu primeiro cadastro.");
    await page.getByLabel("Senha", { exact: true }).fill("estudo123");
    await page.getByLabel("Confirmar senha").fill("estudo123");
    await page.getByRole("checkbox", { name: /praticar de verdade/ }).check();
    await page.getByRole("button", { name: "Criar meu cadastro" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("luminária");
    await expect(page.getByText("Ana, sua mesa está pronta.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Ana" })).toBeVisible();

    await page.getByRole("button", { name: "Apagar a luminária" }).click();
    await expect(page.getByRole("button", { name: "Acender a luminária" })).toBeVisible();
    await page.getByRole("button", { name: "Começar foco" }).click();
    await expect(page.getByRole("button", { name: "Pausar" })).toBeVisible();
    const quote = await page.locator(".quote-card p").innerText();
    await page.getByRole("button", { name: "Outra frase" }).click();
    await expect(page.locator(".quote-card p")).not.toHaveText(quote);

    await page.goto("/exercicios/html-main");
    await page.getByRole("radio", { name: /trecho temático/ }).check();
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Ainda não. Leia o comentário e tente outra vez.")).toBeVisible();
    await page.getByRole("radio", { name: /miolo único/ }).check();
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByText("Isso. Você acertou.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Para guardar" })).toBeVisible();

    await page.goto("/exercicios/mern-order");
    const before = await page.getByRole("listitem").first().innerText();
    await page.getByRole("button", { name: "Descer MongoDB grava ou lê o documento" }).click();
    await expect(page.getByRole("listitem").first()).not.toHaveText(before);

    await page.goto("/sala");
    await page.getByLabel("Nota da sessão").fill("Fechei o exercício do main.");
    await page.getByRole("button", { name: "Guardar sessão" }).click();
    await expect(page.getByText("Fechei o exercício do main.")).toBeVisible();

    await page.getByRole("button", { name: "Sair" }).click();
    await page.goto("/entrar");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha").fill("senha-errada1");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("E-mail ou senha não conferem.")).toBeVisible();
    await page.getByLabel("Senha").fill("estudo123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("link", { name: "Ana" })).toBeVisible();
  });
});
