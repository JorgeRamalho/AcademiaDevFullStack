import { Link } from "react-router-dom";
import { PageIntro, SectionHeading } from "../components/ui";
import { usePageMeta } from "../hooks";
import { HOME_PILLAR_CARDS, SITE_NAME, layerLabel } from "../labels";

const tocItems = [
  { id: "conceito", label: "Conceito" },
  { id: "camadas", label: "Camadas" },
  { id: "pilares", label: "Pilares" },
  { id: "http-api", label: "HTTP e API" },
  { id: "dados", label: "Banco de dados" },
  { id: "auth", label: "Autenticação" },
  { id: "portal", label: "Este portal" },
  { id: "estudo", label: "Como estudar" },
  { id: "deploy", label: "Publicação" },
  { id: "glossario", label: "Glossário" },
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DocumentationPage() {
  usePageMeta(
    `Documentação Full Stack — ${SITE_NAME}`,
    "Referência sobre desenvolvimento Full Stack: camadas, pilares MERN, MEAN, LAMP e .NET, HTTP, APIs, banco de dados, autenticação e como este portal organiza o estudo.",
  );

  return (
    <div className="page doc-page">
      <PageIntro
        eyebrow="Documentação"
        title="Full Stack, do conceito à prática."
        text="Esta página reúne o que você precisa saber para navegar o portal e entender como interface, API e banco trabalham juntos — nos quatro pilares e na stack que roda a Academia DEVFullStack."
      />

      <nav className="doc-toc" aria-label="Índice da documentação">
        <ul className="chip-list">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="section" id="conceito">
        <SectionHeading
          index="01"
          eyebrow="Conceito"
          title="O que é desenvolvimento Full Stack?"
          text="Full Stack é o ofício de construir e manter um sistema completo: o que a pessoa vê no navegador, a lógica que processa pedidos no servidor e a forma como os dados são guardados e consultados."
        />
        <div className="prose">
          <p>
            Um desenvolvedor Full Stack não precisa dominar tudo ao mesmo tempo, mas precisa enxergar o fluxo inteiro.
            Uma ação na tela — clicar em cadastrar, por exemplo — dispara uma requisição HTTP, a API valida e transforma
            essa informação, o banco persiste o registro e a resposta volta para a interface atualizar o que você vê.
          </p>
          <p>
            As trilhas deste portal (MERN, MEAN, LAMP e .NET) são jeitos diferentes de montar as mesmas três camadas. A
            linguagem e as ferramentas mudam; o raciocínio — tela, regra, dado — permanece.
          </p>
        </div>
      </section>

      <section className="section" id="camadas">
        <SectionHeading
          index="02"
          eyebrow="Arquitetura"
          title="Três camadas, uma banca só."
          text="Separar responsabilidades evita que a interface vire um amontoado de regras de negócio e que o banco seja acessado direto do navegador."
        />
        <ol className="path-grid">
          <li>
            <h3>Interface (front-end)</h3>
            <p>
              HTML5 estrutura o conteúdo com semântica. CSS3 define layout, cor e responsividade. JavaScript (e
              TypeScript) adiciona comportamento. Frameworks como React, Angular ou Vue organizam a tela em componentes
              reutilizáveis e estado previsível.
            </p>
          </li>
          <li>
            <h3>Lógica (back-end)</h3>
            <p>
              O servidor recebe pedidos, aplica regras, conversa com o banco e devolve JSON (ou HTML, nas pilhas
              clássicas). Node.js com Express, PHP, C# com ASP.NET e outras runtimes cumprem o mesmo papel: ser a porta
              de entrada segura do sistema.
            </p>
          </li>
          <li>
            <h3>Dados (persistência)</h3>
            <p>
              SQLite, PostgreSQL e MySQL guardam linhas e colunas com SQL. MongoDB guarda documentos JSON. A escolha
              depende de como você lê, cruza e escala os dados — não de moda.
            </p>
          </li>
        </ol>
        <p className="meta-line">
          No <Link to="/mapa">mapa de ferramentas</Link> você encontra cada tecnologia classificada em{" "}
          {layerLabel("front")}, {layerLabel("back")}, {layerLabel("data")} e {layerLabel("infra")}.
        </p>
      </section>

      <section className="section" id="pilares">
        <SectionHeading
          index="03"
          eyebrow="Pilares"
          title="MERN, MEAN, LAMP e .NET."
          text="Quatro stacks tradicionais. Todas entregam aplicação web completa; a diferença está nas linguagens e nos frameworks de cada camada."
        />
        <div className="pillar-grid">
          {HOME_PILLAR_CARDS.map((pillar) => (
            <article key={pillar.slug} className="track-card track-card--neutral">
              <p className="stack-line">{pillar.stack}</p>
              <h3>{pillar.name}</h3>
              <p>{pillar.summary}</p>
              <Link to={`/trilhas/${pillar.slug}`}>Ver trilha {pillar.name}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="http-api">
        <SectionHeading
          index="04"
          eyebrow="Comunicação"
          title="HTTP, REST e JSON."
        />
        <div className="prose">
          <p>
            A web conversa por HTTP. O método indica a intenção: <strong>GET</strong> lê, <strong>POST</strong> cria,{" "}
            <strong>PUT</strong> ou <strong>PATCH</strong> atualizam, <strong>DELETE</strong> remove. O caminho (URL) e
            os cabeçalhos completam o pedido; o corpo costuma trazer JSON quando há dados para enviar.
          </p>
          <p>
            Uma API REST expõe recursos como rotas previsíveis — por exemplo <code>/api/trilhas</code> e{" "}
            <code>/api/exercicios/:slug</code>. A interface React deste portal usa <code>fetch</code> para chamar essas
            rotas e renderizar o resultado.
          </p>
          <pre>
            <code>GET /api/trilhas → 200 OK + lista em JSON</code>
          </pre>
          <p>
            Status HTTP importam: 400 para entrada inválida, 401 quando falta autenticação, 404 quando o recurso não
            existe, 500 quando algo falhou no servidor. A documentação de cada endpoint do projeto está implementada no
            código em <code>server/src/index.ts</code>.
          </p>
        </div>
      </section>

      <section className="section" id="dados">
        <SectionHeading
          index="05"
          eyebrow="Persistência"
          title="Banco relacional e banco de documentos."
        />
        <div className="prose">
          <p>
            <strong>SQL (relacional):</strong> tabelas, chaves primárias, chaves estrangeiras e consultas com{" "}
            <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code> e <code>DELETE</code>. Este portal usa SQLite
            em desenvolvimento; o mesmo modelo serve PostgreSQL e MySQL em produção.
          </p>
          <p>
            <strong>NoSQL (documentos):</strong> MongoDB armazena registros inteiros em JSON. Nas trilhas MERN e MEAN, o
            documento substitui várias tabelas quando o registro é lido de uma vez.
          </p>
          <p>
            Detalhes das tabelas locais — <code>students</code>, <code>tracks</code>, <code>lessons</code>,{" "}
            <code>exercises</code> e outras — estão na página <Link to="/dados">Dados</Link>, com contagem de registros
            e colunas expostas pela API.
          </p>
        </div>
      </section>

      <section className="section" id="auth">
        <SectionHeading
          index="06"
          eyebrow="Segurança"
          title="Cadastro, login e sessão."
        />
        <ul className="checklist">
          <li>
            <strong>Validação em duas camadas</strong>
            <span>O formulário React avisa cedo; a API valida de novo porque qualquer cliente pode chamar a rota.</span>
          </li>
          <li>
            <strong>Senha com hash</strong>
            <span>A senha nunca é guardada em texto puro. O servidor usa scrypt e grava apenas o hash em password_hash.</span>
          </li>
          <li>
            <strong>JWT</strong>
            <span>Após o login, um token assinado identifica a sessão. O front envia Authorization: Bearer no cabeçalho.</span>
          </li>
          <li>
            <strong>Rotas protegidas</strong>
            <span>Sala de estudos, perfil e registro de sessões exigem usuário autenticado.</span>
          </li>
        </ul>
        <p>
          <Link className="button button-ghost" to="/cadastro">Criar conta</Link>{" "}
          <Link className="button button-primary" to="/entrar">Entrar</Link>
        </p>
      </section>

      <section className="section" id="portal">
        <SectionHeading
          index="07"
          eyebrow="Academia DEVFullStack"
          title="Como este site está montado."
        />
        <div className="prose">
          <p>
            <strong>Cliente:</strong> React 19 + TypeScript + Vite + React Router. Estilos em CSS com tema escuro,
            componentes de página e hooks para meta tags e chamadas à API.
          </p>
          <p>
            <strong>Servidor:</strong> Node.js + Express. Rotas REST para trilhas, exercícios, ferramentas, cadastro,
            login, sala de estudos e esquema do banco.
          </p>
          <p>
            <strong>Banco:</strong> SQLite via módulo nativo <code>node:sqlite</code>. Conteúdo pedagógico (módulos,
            aulas, exercícios) é semeado a partir de <code>server/src/tracks.ts</code> e{" "}
            <code>server/src/catalog.ts</code>.
          </p>
          <p>
            <strong>Testes:</strong> Playwright cobre SEO, acessibilidade básica, responsividade e fluxos de cadastro e
            estudo.
          </p>
        </div>
        <aside className="aside-note">
          Em produção estática (Live Server), o front usa HashRouter e aponta a API para{" "}
          <code>http://127.0.0.1:4000</code> quando necessário. Em desenvolvimento, o Vite faz proxy para a mesma API.
        </aside>
      </section>

      <section className="section" id="estudo">
        <SectionHeading
          index="08"
          eyebrow="Percurso"
          title="Como usar o portal no dia a dia."
        />
        <ol className="strategy">
          <li>
            Escolha um pilar em <Link to="/trilhas">Trilhas</Link> ou na home. Cada trilha tem níveis iniciante,
            intermediário e avançado com aulas no banco.
          </li>
          <li>
            Pratique em <Link to="/exercicios">Exercícios</Link>: questões de múltipla escolha, preenchimento e
            ordenação, com ilustração e explicação após enviar.
          </li>
          <li>
            Use a <Link to="/sala">Sala de estudos</Link> para ciclos de foco (timer de 25 minutos), checklist e notas
            de sessão ligadas à sua conta.
          </li>
          <li>
            Consulte o <Link to="/mapa">Mapa</Link> quando precisar situar uma ferramenta na camada certa do sistema.
          </li>
          <li>
            Acompanhe seu progresso em <Link to="/eu">Meu caderno</Link> após o cadastro.
          </li>
        </ol>
      </section>

      <section className="section" id="deploy">
        <SectionHeading
          index="09"
          eyebrow="Produção"
          title="Do localhost ao ambiente real."
        />
        <ul className="checklist">
          <li>
            <strong>Porta</strong>
            <span>O servidor escuta 0.0.0.0 e a porta definida por variável de ambiente (ex.: 4000).</span>
          </li>
          <li>
            <strong>Segredos</strong>
            <span>ACADEMIA_DEVFULLSTACK_SECRET e caminho do banco ficam no .env, nunca no repositório.</span>
          </li>
          <li>
            <strong>Banco gerenciado</strong>
            <span>Em hospedagem com disco efêmero, use Postgres ou outro serviço persistente em vez de arquivo SQLite local.</span>
          </li>
          <li>
            <strong>Build do front</strong>
            <span><code>npm run build:site</code> gera os arquivos estáticos; a API roda como processo separado.</span>
          </li>
        </ul>
        <p>
          Mais detalhes em <Link to="/dados">Banco e infraestrutura</Link>.
        </p>
      </section>

      <section className="section" id="glossario">
        <SectionHeading
          index="10"
          eyebrow="Referência rápida"
          title="Glossário Full Stack."
        />
        <dl className="facts doc-glossary">
          <div>
            <dt>API</dt>
            <dd>Interface pela qual programas trocam dados; aqui, REST em JSON.</dd>
          </div>
          <div>
            <dt>Componente</dt>
            <dd>Peça reutilizável da interface (React, Angular, Vue).</dd>
          </div>
          <div>
            <dt>Endpoint</dt>
            <dd>URL + método HTTP que executa uma ação no servidor.</dd>
          </div>
          <div>
            <dt>Hash</dt>
            <dd>Transformação irreversível da senha para armazenamento seguro.</dd>
          </div>
          <div>
            <dt>JWT</dt>
            <dd>Token assinado que representa a sessão do usuário.</dd>
          </div>
          <div>
            <dt>ORM / SQL direto</dt>
            <dd>Formas de falar com o banco; este projeto usa SQL preparado no SQLite.</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>Conjunto de tecnologias escolhidas para front, back e dados.</dd>
          </div>
          <div>
            <dt>TypeScript</dt>
            <dd>JavaScript com tipos estáticos; usado no cliente e recomendado no servidor.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
