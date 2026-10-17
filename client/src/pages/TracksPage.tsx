import { Link } from "react-router-dom";
import { accentStyle, LoadError, Loading, PageIntro } from "../components/ui";
import { SITE_NAME } from "../labels";
import { useApi, usePageMeta } from "../hooks";
import type { TrackSummary } from "../types";

export function TracksPage() {
  usePageMeta(`Trilhas — ${SITE_NAME}`, "Quatro pilares Full Stack: MERN, MEAN, LAMP e .NET, do iniciante ao avançado.");
  const tracks = useApi<TrackSummary[]>("/api/tracks");

  return (
    <div className="page">
      <PageIntro
        eyebrow="Trilhas"
        title="Escolha o pilar. O ofício continua o mesmo."
        text="Cada trilha tem três blocos: iniciante, intermediário e avançado. As aulas vivem no banco e chegam pela API."
      />
      {tracks.loading ? <Loading label="Abrindo as trilhas…" /> : null}
      {tracks.error ? <LoadError message={tracks.error} onRetry={tracks.reload} /> : null}
      {tracks.data ? (
        <div className="track-grid">
          {tracks.data.map((track) => (
            <article key={track.slug} className="track-card" style={accentStyle(track.color)}>
              <p className="stack-line">{track.stack}</p>
              <h2>{track.name}</h2>
              <p>{track.promise}</p>
              <p>{track.summary}</p>
              <Link to={`/trilhas/${track.slug}`}>Entrar na trilha</Link>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
