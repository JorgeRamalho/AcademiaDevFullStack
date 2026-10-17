import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { LoadError, Loading, PageIntro } from "../components/ui";
import { usePageMeta } from "../hooks";
import { SITE_NAME, levelLabel, pillarLabel } from "../labels";
import type { ExerciseDetail, Pillar } from "../types";

type Filter = "todas" | Pillar;

const filters: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "mern", label: "MERN" },
  { id: "mean", label: "MEAN" },
  { id: "lamp", label: "LAMP" },
  { id: "dotnet", label: ".NET" },
];

export function ExercisesPage() {
  usePageMeta(`Exercícios — ${SITE_NAME}`, "Atividades ilustradas de HTML, CSS, JavaScript, TypeScript, React, API, SQL e autenticação.");
  const { token, ready } = useAuth();
  const [items, setItems] = useState<ExerciseDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("todas");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!ready) {
      return;
    }
    let active = true;
    api<ExerciseDetail[]>("/api/exercises", {}, token).then(
      (data) => {
        if (active) {
          setItems(data);
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Falha ao carregar.");
        }
      },
    );
    return () => {
      active = false;
    };
  }, [ready, token, nonce]);

  const visible = items?.filter((item) => filter === "todas" || item.trackSlug === filter) ?? [];

  return (
    <div className="page">
      <PageIntro
        eyebrow="Exercícios"
        title="Pratique a ideia com uma figura do lado."
        text="Múltipla escolha, uma palavra ou uma ordem. Errar mostra uma dica. Acertar guarda o comentário — e o acerto, se você estiver inscrito."
      />
      <div className="filters" role="group" aria-label="Filtrar por pilar">
        {filters.map((item) => (
          <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {!items && !error ? <Loading label="Separando os exercícios…" /> : null}
      {error ? <LoadError message={error} onRetry={() => setNonce((value) => value + 1)} /> : null}
      {items && visible.length === 0 ? <p className="status">Nenhum exercício neste pilar.</p> : null}
      <div className="exercise-grid">
        {visible.map((item) => (
          <article key={item.slug} className="exercise-card">
            <p className="eyebrow">
              {item.trackName} · {levelLabel(item.level)}
              {item.solved ? " · resolvido" : ""}
            </p>
            <h2>{item.title}</h2>
            <p>{item.prompt}</p>
            <Link to={`/exercicios/${item.slug}`}>Abrir exercício</Link>
          </article>
        ))}
      </div>
      <p className="meta-line">O filtro de pilar usa {pillarLabel("mern")}, {pillarLabel("mean")}, {pillarLabel("lamp")} e {pillarLabel("dotnet")}.</p>
    </div>
  );
}
