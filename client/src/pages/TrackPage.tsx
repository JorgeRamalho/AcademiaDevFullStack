import { Link, useParams } from "react-router-dom";
import { LoadError, Loading, PageIntro, Paragraphs } from "../components/ui";
import { useApi, usePageMeta } from "../hooks";
import { SITE_NAME, levelLabel } from "../labels";
import type { TrackDetail } from "../types";

export function TrackPage() {
  const { slug = "" } = useParams();
  const track = useApi<TrackDetail>(`/api/tracks/${slug}`);
  usePageMeta(
    track.data ? `${track.data.name} — ${SITE_NAME}` : `Trilha — ${SITE_NAME}`,
    track.data?.summary ?? `Aula de uma trilha Full Stack da ${SITE_NAME}.`,
  );

  return (
    <div className="page">
      {track.loading ? <Loading label="Abrindo a trilha…" /> : null}
      {track.error ? <LoadError message={track.error} onRetry={track.reload} /> : null}
      {track.data ? (
        <>
          <PageIntro eyebrow={track.data.stack} title={track.data.name} text={track.data.promise} />
          <aside className="aside-note">
            <h2>Ao lado desta trilha</h2>
            <p>{track.data.aside}</p>
          </aside>
          {track.data.modules.map((module) => (
            <section key={module.id} className="module">
              <p className="eyebrow">{levelLabel(module.level)}</p>
              <h2>{module.title}</h2>
              <p className="deck">{module.summary}</p>
              {module.lessons.map((lesson) => (
                <details key={lesson.id} className="lesson">
                  <summary>{lesson.title}</summary>
                  <Paragraphs paragraphs={lesson.paragraphs} />
                </details>
              ))}
            </section>
          ))}
          <section className="section">
            <h2>Exercícios desta trilha</h2>
            <ul className="link-list">
              {track.data.exercises.map((exercise) => (
                <li key={exercise.slug}>
                  <Link to={`/exercicios/${exercise.slug}`}>
                    {exercise.title}
                    <small>{levelLabel(exercise.level)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}
