import { Link } from "react-router-dom";
import { HeroForge } from "../components/HeroForge";
import { Illustration } from "../components/Illustration";
import { Loading, SectionHeading } from "../components/ui";
import { useAuth } from "../auth";
import { useApi, usePageMeta, usePrefersReducedMotion } from "../hooks";
import { HOME_PILLAR_CARDS, SITE_HOME_TITLE, levelLabel } from "../labels";
import type { ExerciseDetail, Overview, Tool } from "../types";

const ticker = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "C#",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQLite",
];

const HOME_DESCRIPTION =
  "Portal de estudos Full Stack do iniciante ao avançado. Trilhas MERN, MEAN, LAMP e .NET, sala de foco, exercícios ilustrados e cadastro com API e banco SQL.";

export function HomePage() {
  usePageMeta(SITE_HOME_TITLE, HOME_DESCRIPTION);
  const reduced = usePrefersReducedMotion();
  const { student } = useAuth();
  const overview = useApi<Overview>("/api/overview");
  const exercises = useApi<ExerciseDetail[]>("/api/exercises");
  const tools = useApi<Tool[]>("/api/tools");
  const featured = exercises.data?.[0];
  const loop = reduced ? ticker : [...ticker, ...ticker];

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Do iniciante ao avançado</p>
          <h1>
            <em>Construa</em> o caminho entre a tela e o banco.
          </h1>
          <p className="deck">
            Um portal de estudos Full Stack. Você se inscreve, acende a sala de foco e pratica com exercícios ilustrados nos
            pilares MERN, MEAN, LAMP e .NET.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to={student ? "/sala" : "/cadastro"}>
              {student ? "Continuar na sala" : "Inscrever meu estudo"}
            </Link>
            <a className="button button-ghost" href="#pilares">
              Ver os pilares
            </a>
          </div>
          <dl className="facts">
            <div>
              <dt>Trilhas</dt>
              <dd>{overview.data ? overview.data.tracks : "—"}</dd>
            </div>
            <div>
              <dt>Aulas</dt>
              <dd>{overview.data ? overview.data.lessons : "—"}</dd>
            </div>
            <div>
              <dt>Exercícios</dt>
              <dd>{overview.data ? overview.data.exercises : "—"}</dd>
            </div>
            <div>
              <dt>Banco</dt>
              <dd>{overview.data ? overview.data.engine : "—"}</dd>
            </div>
          </dl>
        </div>
        <HeroForge />
      </section>

      <div className="marquee" aria-hidden="true">
        <div className={reduced ? "marquee-track is-static" : "marquee-track"}>
          {loop.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="section" id="camadas">
        <SectionHeading
          index="01"
          eyebrow="Como este portal é feito"
          title="Três camadas, uma banca só."
          text="A interface que você usa, a API que decide e o banco que lembra. As trilhas ensinam outros jeitos de montar as mesmas três."
        />
        <div className="layer-grid">
          <article className="layer-card">
            <h3>Interface</h3>
            <p>HTML5, CSS3, JavaScript, TypeScript e React. Formulário, botão, estado e a tela que reage ao dado.</p>
          </article>
          <article className="layer-card">
            <h3>Lógica</h3>
            <p>Node.js recebe o cadastro, confere a senha e devolve JSON. Python, Java, PHP e C# fazem o mesmo ofício nas outras pilhas.</p>
          </article>
          <article className="layer-card">
            <h3>Dados</h3>
            <p>SQLite guarda tabelas de verdade. PostgreSQL, MySQL e MongoDB aparecem nas trilhas como os bancos de produção.</p>
          </article>
        </div>
      </section>

      <section className="section" id="pilares">
        <SectionHeading
          index="02"
          eyebrow="Pilares"
          title="Quatro jeitos de ser full stack."
          text="Escolha um para começar. O ofício — tela, regra, dados — atravessa todos."
        />
        <div className="pillar-grid">
          {HOME_PILLAR_CARDS.map((track) => (
            <article key={track.slug} className="track-card track-card--neutral">
              <p className="stack-line">{track.stack}</p>
              <h3>{track.name}</h3>
              <p>{track.summary}</p>
              <Link to={`/trilhas/${track.slug}`}>Entrar na trilha</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          index="03"
          eyebrow="Percurso"
          title="Do primeiro passo ao sistema no ar."
        />
        <ol className="path-grid">
          <li>
            <h3>Iniciante</h3>
            <p>HTML semântico, CSS que aguenta o celular, a primeira consulta e o verbo HTTP certo.</p>
          </li>
          <li>
            <h3>Intermediário</h3>
            <p>Formulário que grava, componente com estado, serviço que fala com a API e sessão de quem voltou.</p>
          </li>
          <li>
            <h3>Avançado</h3>
            <p>Hash de senha, camadas, consulta com parâmetro e o que muda quando o sistema vai para o ar.</p>
          </li>
        </ol>
      </section>

      <section className="section">
        <SectionHeading
          index="04"
          eyebrow="Prática"
          title="Um exercício que mostra antes de cobrar."
          text="Cada atividade traz uma figura, uma pergunta curta e um comentário para guardar."
        />
        {featured ? (
          <article className="feature-exercise">
            <Illustration kind={featured.illustration} />
            <div>
              <p className="eyebrow">
                {featured.trackName} · {levelLabel(featured.level)}
              </p>
              <h3>{featured.title}</h3>
              <p>{featured.prompt}</p>
              <Link className="button button-primary" to={`/exercicios/${featured.slug}`}>
                Resolver este
              </Link>
            </div>
          </article>
        ) : null}
        {exercises.loading ? <Loading label="Separando um exercício…" /> : null}
      </section>

      <section className="section" id="sala-convite">
        <SectionHeading
          index="05"
          eyebrow="Sala de estudos"
          title="Vinte e cinco minutos, uma luminária, uma nota."
          text="A sala guarda o foco na sua conta: trilha escolhida, lista curta e os minutos que você registrar."
        />
        <p>
          <Link className="button button-ghost" to="/sala">
            Entrar na sala
          </Link>
        </p>
      </section>

      <section className="section">
        <SectionHeading index="06" eyebrow="Mapa" title="As ferramentas, uma a uma." />
        {tools.data ? (
          <ul className="chip-list">
            {tools.data.map((tool) => (
              <li key={tool.slug}>
                <a href={`/mapa#${tool.slug}`}>{tool.name}</a>
              </li>
            ))}
          </ul>
        ) : null}
        <p>
          <Link to="/mapa">Abrir o mapa completo</Link>
        </p>
      </section>

      <section className="closing">
        <h2>Crie o cadastro e acenda a sala.</h2>
        <p>Nome, nível, pilar e um objetivo. A API valida de novo e o banco guarda o hash da senha.</p>
        <Link className="button button-primary" to={student ? "/sala" : "/cadastro"}>
          {student ? "Voltar para a sala" : "Começar pelo cadastro"}
        </Link>
      </section>
    </div>
  );
}
