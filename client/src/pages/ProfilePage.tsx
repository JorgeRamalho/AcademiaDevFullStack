import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { Loading, PageIntro, cssVars } from "../components/ui";
import { usePageMeta } from "../hooks";
import { SITE_NAME, formatWhen, levelLabel, pillarLabel } from "../labels";
import type { Progress } from "../types";

export function ProfilePage() {
  usePageMeta(`Meu caderno — ${SITE_NAME}`, "Seu cadastro, a trilha escolhida e o progresso nos exercícios.");
  const { student, token, ready } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    let active = true;
    api<Progress>("/api/progress", {}, token).then((data) => {
      if (active) {
        setProgress(data);
      }
    }, () => {
      if (active) {
        setProgress(null);
      }
    });
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready) {
    return <Loading label="Abrindo seu caderno…" />;
  }
  if (!student) {
    return <Navigate to="/entrar" replace state={{ from: "/eu" }} />;
  }

  const ratio = progress && progress.total > 0 ? Math.round((progress.solved / progress.total) * 100) : 0;

  return (
    <div className="page narrow">
      <PageIntro eyebrow="Caderno" title={student.name} text={student.goal || "Sem objetivo escrito ainda. A sala aceita uma nota a cada ciclo."} />
      <dl className="profile-facts">
        <div>
          <dt>E-mail</dt>
          <dd>{student.email}</dd>
        </div>
        <div>
          <dt>Nível</dt>
          <dd>{levelLabel(student.level)}</dd>
        </div>
        <div>
          <dt>Pilar</dt>
          <dd>{pillarLabel(student.pillar)}</dd>
        </div>
        <div>
          <dt>Desde</dt>
          <dd>{formatWhen(student.createdAt)}</dd>
        </div>
      </dl>
      <div className="progress-meter" style={cssVars({ "--progress": `${ratio}%` })}>
        <p>
          <strong>{progress ? progress.solved : "—"}</strong> de {progress ? progress.total : "—"} exercícios
        </p>
        <p>{progress ? progress.minutes : 0} minutos registrados</p>
      </div>
      <div className="hero-actions">
        <Link className="button button-primary" to="/sala">
          Ir para a sala
        </Link>
        <Link className="button button-ghost" to={`/trilhas/${student.pillar}`}>
          Continuar {pillarLabel(student.pillar)}
        </Link>
      </div>
    </div>
  );
}
