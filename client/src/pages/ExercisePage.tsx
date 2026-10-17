import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { AnswerForm } from "../components/AnswerForm";
import { Illustration } from "../components/Illustration";
import { LoadError, Loading } from "../components/ui";
import { usePageMeta } from "../hooks";
import { SITE_NAME } from "../labels";
import type { ExerciseDetail } from "../types";

export function ExercisePage() {
  const { slug = "" } = useParams();
  const { token, ready } = useAuth();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  usePageMeta(
    exercise ? `${exercise.title} — ${SITE_NAME}` : `Exercício — ${SITE_NAME}`,
    exercise?.prompt ?? `Exercício ilustrado da ${SITE_NAME}.`,
  );

  useEffect(() => {
    if (!ready) {
      return;
    }
    let active = true;
    setExercise(null);
    setError(null);
    api<ExerciseDetail>(`/api/exercises/${slug}`, {}, token).then(
      (data) => {
        if (active) {
          setExercise(data);
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
  }, [ready, slug, token, nonce]);

  return (
    <div className="page">
      <p>
        <Link to="/exercicios">Todos os exercícios</Link>
      </p>
      {!exercise && !error ? <Loading label="Abrindo o exercício…" /> : null}
      {error ? <LoadError message={error} onRetry={() => setNonce((value) => value + 1)} /> : null}
      {exercise ? (
        <article className="exercise-layout">
          <Illustration kind={exercise.illustration} />
          <div>
            <p className="eyebrow">{exercise.trackName}</p>
            <h1>{exercise.title}</h1>
            <p className="deck">{exercise.prompt}</p>
            <AnswerForm key={exercise.slug} exercise={exercise} />
          </div>
        </article>
      ) : null}
    </div>
  );
}
