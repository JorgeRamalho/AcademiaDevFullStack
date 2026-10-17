import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks";
import { SITE_NAME } from "../labels";

export function NotFoundPage() {
  usePageMeta(`Página não encontrada — ${SITE_NAME}`, `Esse endereço não existe na ${SITE_NAME}.`);

  return (
    <div className="page narrow not-found">
      <p className="eyebrow">404</p>
      <h1>Essa página não está na trilha.</h1>
      <p className="deck">O endereço não corresponde a uma aula, um exercício ou a sala.</p>
      <Link className="button button-primary" to="/">
        Voltar ao início
      </Link>
    </div>
  );
}
