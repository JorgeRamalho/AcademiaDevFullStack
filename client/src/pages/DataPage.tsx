import { LoadError, Loading, PageIntro } from "../components/ui";
import { useApi, usePageMeta } from "../hooks";
import { SITE_NAME } from "../labels";
import type { SchemaResponse } from "../types";

function tableNote(name: string): string {
  switch (name) {
    case "students":
      return "Quem se inscreveu.";
    case "tracks":
      return "Os quatro pilares.";
    case "modules":
      return "Blocos de cada trilha.";
    case "lessons":
      return "Textos de cada bloco.";
    case "exercises":
      return "Atividades práticas.";
    case "attempts":
      return "Tentativas dos exercícios.";
    case "study_sessions":
      return "Minutos registrados na sala.";
    case "tools":
      return "O mapa de tecnologias.";
    default:
      return "Tabela do portal.";
  }
}

export function DataPage() {
  usePageMeta(`Banco e infraestrutura — ${SITE_NAME}`, `O modelo relacional da ${SITE_NAME}, a estratégia de camadas e o que muda no deploy.`);
  const schema = useApi<SchemaResponse>("/api/schema");

  return (
    <div className="page">
      <PageIntro
        eyebrow="Banco e infraestrutura"
        title="Tabelas de verdade, senha em hash."
        text="Este portal usa SQLite. O SQL é o mesmo raciocínio de PostgreSQL e MySQL: linha, coluna, chave e filtro. MongoDB, nas trilhas MERN e MEAN, guarda documento em vez de linha."
      />

      {schema.loading ? <Loading label="Lendo o esquema…" /> : null}
      {schema.error ? <LoadError message={schema.error} onRetry={schema.reload} /> : null}
      {schema.data ? (
        <>
          <p className="aside-note">{schema.data.note}</p>
          <div className="schema-grid">
            {schema.data.tables.map((table) => (
              <article key={table.name} className="tool-card">
                <h2>
                  <code>{table.name}</code>
                </h2>
                <p>{tableNote(table.name)}</p>
                <p className="meta-line">{table.count} registros</p>
                <ul className="column-list">
                  {table.columns.map((column) => (
                    <li key={column.name}>
                      <code>{column.name}</code>
                      <span>{column.type || "coluna"}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </>
      ) : null}

      <section className="section strategy">
        <h2>Estratégia deste projeto</h2>
        <ol>
          <li>A interface em React não decide sozinha. Ela pede, a API responde.</li>
          <li>O formulário avisa na hora. O servidor valida de novo, porque a rota pode ser chamada direto.</li>
          <li>A senha vira hash com scrypt. A coluna se chama password_hash.</li>
          <li>Aulas, exercícios e ferramentas vivem no banco. A tela só apresenta.</li>
          <li>O Playwright percorre a página como quem estuda: estrutura, tipo, celular e o fluxo de inscrição.</li>
        </ol>
      </section>

      <section className="section">
        <h2>Quando for publicar</h2>
        <ul className="checklist">
          <li>
            <strong>Porta</strong>
            <span>O processo escuta a porta do ambiente, em todas as interfaces, não um número cravado só na sua máquina.</span>
          </li>
          <li>
            <strong>Segredo</strong>
            <span>A chave do token fica em variável de ambiente. Não entra no código.</span>
          </li>
          <li>
            <strong>Disco</strong>
            <span>Arquivo local some quando o servidor reinicia em disco efêmero. Produção pede um banco gerenciado.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
