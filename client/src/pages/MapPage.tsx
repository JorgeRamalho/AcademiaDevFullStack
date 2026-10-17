import { Link } from "react-router-dom";
import { LoadError, Loading, PageIntro } from "../components/ui";
import { useApi, usePageMeta } from "../hooks";
import { SITE_NAME, isToolLayer, layerLabel, pillarLabel } from "../labels";
import type { Tool, ToolLayer } from "../types";

const order: ToolLayer[] = ["front", "back", "data", "infra"];

export function MapPage() {
  usePageMeta(
    `Mapa das ferramentas — ${SITE_NAME}`,
    "HTML, CSS, JavaScript, TypeScript, React, Angular, Vue, Node, Python, Java, PHP, C#, PostgreSQL, MySQL, MongoDB e a infraestrutura do portal.",
  );
  const tools = useApi<Tool[]>("/api/tools");

  return (
    <div className="page">
      <PageIntro
        eyebrow="Mapa"
        title="Cada ferramenta no seu ofício."
        text="O portal é feito com React, TypeScript, Node.js e SQL. As outras linguagens estão aqui como estudo, ligadas à trilha em que fazem mais sentido."
      />
      {tools.loading ? <Loading label="Abrindo o mapa…" /> : null}
      {tools.error ? <LoadError message={tools.error} onRetry={tools.reload} /> : null}
      {tools.data
        ? order.map((layer) => {
            const group = tools.data?.filter((tool) => isToolLayer(tool.layer) && tool.layer === layer) ?? [];
            if (group.length === 0) {
              return null;
            }
            return (
              <section key={layer} className="section">
                <h2>{layerLabel(layer)}</h2>
                <div className="tool-grid">
                  {group.map((tool) => (
                    <article key={tool.slug} id={tool.slug} className="tool-card">
                      <h3>{tool.name}</h3>
                      <p>{tool.summary}</p>
                      {tool.track ? (
                        <Link to={`/trilhas/${tool.track}`}>Praticar na trilha {pillarLabel(tool.track)}</Link>
                      ) : layer === "data" || layer === "infra" ? (
                        <Link to="/dados">Ver banco e infraestrutura</Link>
                      ) : (
                        <Link to="/exercicios">Ir para os exercícios</Link>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })
        : null}
    </div>
  );
}
