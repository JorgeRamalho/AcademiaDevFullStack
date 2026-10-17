import { useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../auth";
import { FieldError, Loading, PageIntro } from "../components/ui";
import { usePageMeta } from "../hooks";
import { SITE_NAME, pillarLabel } from "../labels";
import type { Level, Pillar } from "../types";

type Fields = Partial<Record<"name" | "email" | "password" | "confirm" | "level" | "pillar" | "goal" | "aceite", string>>;

const levels: { id: Level; title: string; text: string }[] = [
  { id: "iniciante", title: "Iniciante", text: "Estou no HTML, no CSS e na lógica básica." },
  { id: "intermediario", title: "Intermediário", text: "Já fiz tela e quero a API." },
  { id: "avancado", title: "Avançado", text: "Quero autenticação, dados e deploy." },
];

const pillars: { id: Pillar; title: string; text: string }[] = [
  { id: "mern", title: "MERN", text: "JavaScript em toda a pilha." },
  { id: "mean", title: "MEAN", text: "Angular e TypeScript na frente." },
  { id: "lamp", title: "LAMP", text: "PHP, MySQL e o clássico da web." },
  { id: "dotnet", title: ".NET", text: "C# e ASP.NET." },
];

function pickFields(source: Record<string, string>): Fields {
  const fields: Fields = {};
  const keys = ["name", "email", "password", "confirm", "level", "pillar", "goal", "aceite"] as const;
  for (const key of keys) {
    const value = source[key];
    if (value) {
      fields[key] = value;
    }
  }
  return fields;
}

function validate(values: {
  name: string;
  email: string;
  password: string;
  confirm: string;
  level: string;
  pillar: string;
  goal: string;
  aceite: boolean;
}): Fields {
  const fields: Fields = {};
  if (values.name.trim().length < 2 || values.name.trim().length > 80) {
    fields.name = "Informe seu nome.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    fields.email = "Informe um e-mail válido.";
  }
  if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    fields.password = "Use 8 caracteres, com letra e número.";
  }
  if (values.password !== values.confirm) {
    fields.confirm = "A confirmação não bate com a senha.";
  }
  if (values.level !== "iniciante" && values.level !== "intermediario" && values.level !== "avancado") {
    fields.level = "Escolha seu nível.";
  }
  if (values.pillar !== "mern" && values.pillar !== "mean" && values.pillar !== "lamp" && values.pillar !== "dotnet") {
    fields.pillar = "Escolha um pilar.";
  }
  if (values.goal.trim().length > 280) {
    fields.goal = "Encurte o objetivo para 280 caracteres.";
  }
  if (!values.aceite) {
    fields.aceite = "Confirme que vai praticar.";
  }
  return fields;
}

export function RegisterPage() {
  usePageMeta(`Cadastro — ${SITE_NAME}`, `Inscreva-se na ${SITE_NAME}: nome, nível, pilar de estudo e uma senha que vira hash.`);
  const { student, ready, register } = useAuth();
  const navigate = useNavigate();
  const registered = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [level, setLevel] = useState("");
  const [pillar, setPillar] = useState("");
  const [goal, setGoal] = useState("");
  const [aceite, setAceite] = useState(false);
  const [fields, setFields] = useState<Fields>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  if (!ready) {
    return <Loading label="Abrindo o cadastro…" />;
  }
  if (student && !registered.current) {
    return <Navigate to="/sala" replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate({ name, email, password, confirm, level, pillar, goal, aceite });
    setFields(next);
    setFormError("");
    const first = Object.keys(next)[0];
    if (first) {
      setFormError("Revise os campos destacados.");
      document.getElementById(first)?.focus();
      return;
    }
    if (level !== "iniciante" && level !== "intermediario" && level !== "avancado") {
      return;
    }
    if (pillar !== "mern" && pillar !== "mean" && pillar !== "lamp" && pillar !== "dotnet") {
      return;
    }
    setPending(true);
    registered.current = true;
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        level,
        pillar,
        goal: goal.trim(),
        aceite: true,
      });
      navigate("/sala", { state: { welcome: true } });
    } catch (error) {
      registered.current = false;
      if (error instanceof ApiError) {
        setFields(pickFields(error.fields));
        setFormError(error.message);
        const serverFirst = Object.keys(error.fields)[0];
        if (serverFirst) {
          document.getElementById(serverFirst)?.focus();
        }
      } else {
        setFormError("Não foi possível inscrever agora.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page narrow">
      <PageIntro
        eyebrow="Cadastro"
        title="Inscreva seu estudo."
        text="A tela confere os campos. A API confere de novo. A senha não sai daqui em texto puro."
      />
      <form className="form-card" onSubmit={onSubmit} noValidate>
        {formError ? (
          <p className="form-error" role="alert">
            {formError}
          </p>
        ) : null}

        <fieldset>
          <legend>Quem é você</legend>
          <label className="field" htmlFor="name">
            Nome
            <input id="name" name="name" autoComplete="name" value={name} aria-invalid={Boolean(fields.name)} aria-describedby={fields.name ? "name-error" : undefined} onChange={(event) => setName(event.target.value)} />
          </label>
          <FieldError id="name-error" message={fields.name} />
          <label className="field" htmlFor="email">
            E-mail
            <input id="email" name="email" type="email" autoComplete="email" value={email} aria-invalid={Boolean(fields.email)} aria-describedby={fields.email ? "email-error" : undefined} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <FieldError id="email-error" message={fields.email} />
        </fieldset>

        <fieldset>
          <legend>Seu ponto de partida</legend>
          <div className="choice-grid">
            {levels.map((item) => (
              <label key={item.id} className="choice">
                <input type="radio" name="level" value={item.id} checked={level === item.id} onChange={() => setLevel(item.id)} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </label>
            ))}
          </div>
          <FieldError id="level-error" message={fields.level} />
        </fieldset>

        <fieldset>
          <legend>Pilar</legend>
          <div className="choice-grid">
            {pillars.map((item) => (
              <label key={item.id} className="choice">
                <input type="radio" name="pillar" value={item.id} checked={pillar === item.id} onChange={() => setPillar(item.id)} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </label>
            ))}
          </div>
          <FieldError id="pillar-error" message={fields.pillar} />
          <p className="meta-line">Você pode trocar de trilha depois. {pillarLabel("mern")} é só o ponto de partida se for o caso.</p>
        </fieldset>

        <fieldset>
          <legend>Acesso</legend>
          <label className="field" htmlFor="goal">
            O que você quer construir?
            <textarea id="goal" name="goal" rows={3} maxLength={280} value={goal} placeholder="Ex.: publicar meu primeiro cadastro com tela, API e banco." onChange={(event) => setGoal(event.target.value)} />
          </label>
          <FieldError id="goal-error" message={fields.goal} />
          <label className="field" htmlFor="password">
            Senha
            <input id="password" name="password" type="password" autoComplete="new-password" value={password} aria-invalid={Boolean(fields.password)} aria-describedby="password-hint password-error" onChange={(event) => setPassword(event.target.value)} />
          </label>
          <p id="password-hint" className="hint">
            8 caracteres, com pelo menos uma letra e um número.
          </p>
          <FieldError id="password-error" message={fields.password} />
          <label className="field" htmlFor="confirm">
            Confirmar senha
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" value={confirm} aria-invalid={Boolean(fields.confirm)} aria-describedby={fields.confirm ? "confirm-error" : undefined} onChange={(event) => setConfirm(event.target.value)} />
          </label>
          <FieldError id="confirm-error" message={fields.confirm} />
          <label className="checkline" htmlFor="aceite">
            <input id="aceite" type="checkbox" checked={aceite} onChange={(event) => setAceite(event.target.checked)} />
            <span>Vou praticar de verdade, não só ler.</span>
          </label>
          <FieldError id="aceite-error" message={fields.aceite} />
        </fieldset>

        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Inscrevendo…" : "Criar meu cadastro"}
        </button>
        <p>
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
