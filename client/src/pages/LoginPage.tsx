import { useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../auth";
import { Loading, PageIntro } from "../components/ui";
import { usePageMeta } from "../hooks";
import { SITE_NAME } from "../labels";

export function LoginPage() {
  usePageMeta(`Entrar — ${SITE_NAME}`, `Entre na sua conta da ${SITE_NAME} para continuar a sala de estudos e os exercícios.`);
  const { student, ready, login } = useAuth();
  const navigate = useNavigate();
  const signingIn = useRef(false);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/sala";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!ready) {
    return <Loading label="Abrindo a entrada…" />;
  }
  if (student && !signingIn.current) {
    return <Navigate to="/sala" replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setPending(true);
    signingIn.current = true;
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (loginError) {
      signingIn.current = false;
      setError(loginError instanceof ApiError ? loginError.message : "Não foi possível entrar agora.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page narrow">
      <PageIntro eyebrow="Entrada" title="Bom te ver de novo." text="Use o e-mail do cadastro. A senha é conferida pelo hash, não por uma cópia em texto." />
      <form className="form-card" onSubmit={onSubmit}>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <label className="field" htmlFor="email">
          E-mail
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field" htmlFor="password">
          Senha
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
        <p>
          Ainda não estuda aqui? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </form>
    </div>
  );
}
