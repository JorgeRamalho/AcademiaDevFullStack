import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ApiError, api } from "../api";
import { useAuth } from "../auth";
import { levelLabel } from "../labels";
import type { AttemptResult, ExerciseDetail } from "../types";

type AnswerFormProps = {
  exercise: ExerciseDetail;
  onSolved?: () => void;
};

export function AnswerForm({ exercise, onSolved }: AnswerFormProps) {
  const { token } = useAuth();
  const [selected, setSelected] = useState("");
  const [filled, setFilled] = useState("");
  const [order, setOrder] = useState<string[]>(exercise.type === "order" ? exercise.payload.initial : []);
  const [localError, setLocalError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);

  function move(index: number, direction: -1 | 1) {
    setOrder((current) => {
      const next = current.slice();
      const target = index + direction;
      const currentId = next[index];
      const targetId = next[target];
      if (currentId === undefined || targetId === undefined) {
        return current;
      }
      next[index] = targetId;
      next[target] = currentId;
      return next;
    });
    setResult(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError("");
    let answer: string | string[] = "";
    switch (exercise.type) {
      case "choice":
        if (!selected) {
          setLocalError("Escolha uma alternativa.");
          return;
        }
        answer = selected;
        break;
      case "fill":
        if (filled.trim() === "") {
          setLocalError("Preencha a resposta.");
          return;
        }
        answer = filled.trim();
        break;
      case "order":
        answer = order;
        break;
      default: {
        const unknown: never = exercise;
        setLocalError(`Exercício indisponível: ${String(unknown)}`);
        return;
      }
    }

    setPending(true);
    try {
      const response = await api<AttemptResult>(
        `/api/exercises/${exercise.slug}/attempts`,
        { method: "POST", body: JSON.stringify({ answer }) },
        token,
      );
      setResult(response);
      if (response.correct) {
        onSolved?.();
      }
    } catch (error) {
      setLocalError(error instanceof ApiError ? error.message : "Não foi possível verificar agora.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="answer-form" onSubmit={onSubmit}>
      {exercise.type === "choice" ? (
        <fieldset>
          <legend>Alternativas</legend>
          <div className="options">
            {exercise.payload.options.map((option) => (
              <label key={option.id} className="choice">
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => {
                    setSelected(option.id);
                    setResult(null);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {exercise.type === "fill" ? (
        <label className="field" htmlFor="fill-answer">
          {exercise.payload.label}
          <input
            id="fill-answer"
            value={filled}
            placeholder={exercise.payload.placeholder}
            autoComplete="off"
            onChange={(event) => {
              setFilled(event.target.value);
              setResult(null);
            }}
          />
        </label>
      ) : null}

      {exercise.type === "order" ? (
        <fieldset>
          <legend>Organize da primeira peça para a última</legend>
          <ol className="order-list">
            {order.map((id, index) => {
              const item = exercise.payload.items.find((entry) => entry.id === id);
              if (!item) {
                return null;
              }
              return (
                <li key={id}>
                  <span className="order-index">{index + 1}</span>
                  <span>{item.label}</span>
                  <span className="order-actions">
                    <button type="button" aria-label={`Subir ${item.label}`} disabled={index === 0} onClick={() => move(index, -1)}>
                      Subir
                    </button>
                    <button
                      type="button"
                      aria-label={`Descer ${item.label}`}
                      disabled={index === order.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      Descer
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>
        </fieldset>
      ) : null}

      {localError ? (
        <p className="field-error" role="alert">
          {localError}
        </p>
      ) : null}

      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Verificando…" : "Verificar"}
      </button>

      {result ? (
        <div className={result.correct ? "feedback ok" : "feedback bad"} role="status">
          <p className="feedback-title">{result.correct ? "Isso. Você acertou." : "Ainda não. Leia o comentário e tente outra vez."}</p>
          {result.hint ? <p>{result.hint}</p> : null}
          <h2>Para guardar</h2>
          <p>{result.explanation}</p>
          {!result.saved ? (
            <p>
              <Link to="/cadastro">Crie seu cadastro</Link> para guardar este acerto.
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="meta-line">
        {exercise.trackName} · {levelLabel(exercise.level)}
        {exercise.solved || result?.correct ? " · já resolvido" : ""}
      </p>
    </form>
  );
}
