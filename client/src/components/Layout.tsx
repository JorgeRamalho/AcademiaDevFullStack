import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";
import { SITE_NAME, firstName } from "../labels";

const links = [
  { to: "/mapa", label: "Mapa" },
  { to: "/trilhas", label: "Trilhas" },
  { to: "/exercicios", label: "Exercícios" },
  { to: "/documentacao", label: "Documentação" },
  { to: "/sala", label: "Sala" },
  { to: "/dados", label: "Dados" },
];

export function Layout() {
  const { student, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#conteudo">
        Ir para o conteúdo
      </a>
      <header className="site-header">
        <div className="bar">
          <NavLink className="brand" to="/" aria-label={`${SITE_NAME}, início`}>
            <span className="brand-mark" aria-hidden="true">
              A
            </span>
            <span>
              <strong>{SITE_NAME}</strong>
              <small>estudos full stack</small>
            </span>
          </NavLink>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-principal"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Fechar menu" : "Abrir menu"}
          </button>
          <nav id="menu-principal" className={open ? "nav open" : "nav"} aria-label="Principal">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
            <div className="nav-auth">
              {student ? (
                <>
                  <NavLink to="/eu">{firstName(student.name)}</NavLink>
                  <button type="button" className="button button-ghost" onClick={logout}>
                    Sair
                  </button>
                </>
              ) : (
                <NavLink className="button button-primary" to="/entrar">
                  Entrar
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main id="conteudo" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="brand-line">{SITE_NAME}</p>
            <p>Interface em React e TypeScript. API em Node.js. Dados em SQL.</p>
          </div>
          <nav aria-label="Rodapé">
            <NavLink to="/trilhas">Trilhas</NavLink>
            <NavLink to="/exercicios">Exercícios</NavLink>
            <NavLink to="/documentacao">Documentação</NavLink>
            <NavLink to="/sala">Sala</NavLink>
            <NavLink to="/cadastro">Cadastro</NavLink>
            <NavLink to="/dados">Dados</NavLink>
          </nav>
          <p className="colophon">Composto em Fraunces e Outfit, com código em JetBrains Mono.</p>
        </div>
      </footer>
    </div>
  );
}
