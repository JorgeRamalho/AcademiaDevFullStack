import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ApiError, api } from "../api";
import { useAuth } from "../auth";
import { FieldError, LoadError, Loading, cssVars } from "../components/ui";
import { usePageMeta } from "../hooks";
import { SITE_NAME, firstName, formatWhen, levelLabel, pillarLabel } from "../labels";
import type { Progress, StudyPlan, StudySession } from "../types";

const FOCUS_SECONDS = 25 * 60;

function clock(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function StudyRoomPage() {
  usePageMeta(`Sala de estudos — ${SITE_NAME}`, "Uma sala de foco com luminária, ciclo de 25 minutos e registro da sessão na sua conta.");
  const { student, token, ready } = useAuth();
  const location = useLocation();
  const welcome = Boolean((location.state as { welcome?: boolean } | null)?.welcome);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [lit, setLit] = useState(true);
  const [seconds, setSeconds] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [note, setNote] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!ready) {
      return;
    }
    let active = true;
    const planRequest = api<StudyPlan>("/api/study/plan", {}, token);
    const extra = token
      ? Promise.all([api<StudySession[]>("/api/study/sessions", {}, token), api<Progress>("/api/progress", {}, token)])
      : Promise.resolve(null);
    Promise.all([planRequest, extra]).then(
      ([nextPlan, nextExtra]) => {
        if (!active) {
          return;
        }
        setPlan(nextPlan);
        setSessions(nextExtra ? nextExtra[0] : []);
        setProgress(nextExtra ? nextExtra[1] : null);
        setError(null);
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

  useEffect(() => {
    if (!running) {
      return;
    }
    const id = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const quote = plan?.quotes[quoteIndex % (plan.quotes.length || 1)] ?? "";
  const elapsed = FOCUS_SECONDS - seconds;
  const progressValue = Math.round((elapsed / FOCUS_SECONDS) * 100);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      return;
    }
    if (note.trim().length < 3) {
      setFieldError("Escreva uma nota curta sobre o foco.");
      return;
    }
    setPending(true);
    setFieldError("");
    setFormError("");
    try {
      const created = await api<StudySession>(
        "/api/study/sessions",
        { method: "POST", body: JSON.stringify({ minutes, note: note.trim() }) },
        token,
      );
      setSessions((current) => [created, ...current]);
      setProgress((current) =>
        current
          ? { ...current, minutes: current.minutes + created.minutes, sessions: current.sessions + 1 }
          : current,
      );
      setNote("");
    } catch (saveError) {
      if (saveError instanceof ApiError) {
        setFieldError(saveError.fields.note ?? saveError.fields.minutes ?? "");
        setFormError(saveError.message);
      } else {
        setFormError("Não foi possível guardar a sessão.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page">
      <header className="page-intro">
        <p className="eyebrow">Sala de estudos</p>
        <h1>Acenda a luminária e fique um ciclo.</h1>
        <p className="deck">Vinte e cinco minutos na mesma tarefa. No fim, uma nota curta. O resto pode esperar.</p>
      </header>

      {welcome && student ? (
        <p className="welcome" role="status">
          {firstName(student.name)}, sua mesa está pronta. Começamos pela trilha {pillarLabel(student.pillar)}.
        </p>
      ) : null}

      {!plan && !error ? <Loading label="Preparando a mesa…" /> : null}
      {error ? <LoadError message={error} onRetry={() => setNonce((value) => value + 1)} /> : null}

      {plan ? (
        <div className={lit ? "room is-lit" : "room"}>
          <section className="room-mood" aria-label="Clima da sala">
            <div className="lamp" aria-hidden="true">
              <span className="lamp-glow" />
              <span className="lamp-shade" />
              <span className="lamp-stem" />
            </div>
            <button type="button" className="button button-ghost" onClick={() => setLit((value) => !value)}>
              {lit ? "Apagar a luminária" : "Acender a luminária"}
            </button>
            <blockquote className="quote-card">
              <p>{quote}</p>
            </blockquote>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => setQuoteIndex((value) => value + 1)}
            >
              Outra frase
            </button>
            {student?.goal ? <p className="goal">Seu alvo: {student.goal}</p> : null}
            {progress ? (
              <p className="meta-line">
                {progress.solved} de {progress.total} exercícios · {progress.minutes} minutos na sala
              </p>
            ) : null}
          </section>

          <section className="room-work">
            <div className="timer" style={cssVars({ "--progress": `${progressValue}%` })}>
              <div className="timer-face">
                <p className="timer-clock">{clock(seconds)}</p>
                <p>{seconds === 0 ? "Ciclo fechado. Guarde esses 25 minutos." : "Um ciclo de foco"}</p>
              </div>
              <div className="hero-actions">
                <button type="button" className="button button-primary" onClick={() => setRunning((value) => !value)}>
                  {running ? "Pausar" : "Começar foco"}
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => {
                    setRunning(false);
                    setSeconds(FOCUS_SECONDS);
                  }}
                >
                  Zerar
                </button>
              </div>
            </div>

            <div>
              <h2>{plan.personalized ? `Lista da trilha ${plan.track.name}` : "Um começo sugerido"}</h2>
              <p className="deck">
                {plan.personalized
                  ? "Três aulas no início da trilha que você escolheu no cadastro."
                  : `Ainda sem cadastro: a lista abre na trilha ${plan.track.name}. Inscreva-se para personalizar.`}
              </p>
              <ol className="checklist">
                {plan.tasks.map((task) => (
                  <li key={task.title}>
                    <span>{levelLabel(task.level)}</span>
                    <strong>{task.title}</strong>
                    <small>{task.module}</small>
                  </li>
                ))}
              </ol>
              <p>
                <Link to={`/trilhas/${plan.track.slug}`}>Abrir a trilha {plan.track.name}</Link>
              </p>
            </div>

            {student ? (
              <form className="session-form" onSubmit={onSave}>
                <h2>Guardar esta sessão</h2>
                <label className="field" htmlFor="minutes">
                  Minutos
                  <input
                    id="minutes"
                    type="number"
                    min={1}
                    max={180}
                    value={minutes}
                    onChange={(event) => setMinutes(Number(event.target.value))}
                  />
                </label>
                <label className="field" htmlFor="note">
                  Nota da sessão
                  <textarea
                    id="note"
                    rows={3}
                    maxLength={180}
                    value={note}
                    placeholder="O que você praticou neste ciclo?"
                    onChange={(event) => setNote(event.target.value)}
                  />
                </label>
                <FieldError id="note-error" message={fieldError} />
                {formError ? (
                  <p className="field-error" role="alert">
                    {formError}
                  </p>
                ) : null}
                <button type="submit" className="button button-primary" disabled={pending}>
                  {pending ? "Guardando…" : "Guardar sessão"}
                </button>
              </form>
            ) : (
              <div className="aside-note">
                <h2>Guarde o foco na sua conta</h2>
                <p>A luminária e o relógio funcionam agora. A nota e os minutos ficam salvos depois do cadastro.</p>
                <div className="hero-actions">
                  <Link className="button button-primary" to="/cadastro">
                    Inscrever meu estudo
                  </Link>
                  <Link className="button button-ghost" to="/entrar">
                    Entrar
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {student ? (
        <section className="section">
          <h2>Sessões recentes</h2>
          {sessions.length === 0 ? <p>Nenhuma sessão ainda. Vinte e cinco minutos já mudam o dia.</p> : null}
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={session.id}>
                <strong>
                  {session.minutes} min · {session.trackName}
                </strong>
                <span>{session.note}</span>
                <small>{formatWhen(session.createdAt)}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
