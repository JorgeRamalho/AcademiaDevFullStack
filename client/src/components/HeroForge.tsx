import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { usePrefersReducedMotion } from "../hooks";

const layers = [
  {
    id: "front",
    kicker: "Front-end",
    label: "Interface",
    code: `export function Saudacao() {
  return <h1>Olá, estudante</h1>;
}`,
  },
  {
    id: "back",
    kicker: "Back-end",
    label: "Lógica",
    code: `app.post("/api/auth/register", (req, res) => {
  const aluno = criarAluno(req.body);
  res.status(201).json(aluno);
});`,
  },
  {
    id: "data",
    kicker: "Banco e infra",
    label: "Dados",
    code: `SELECT nome
FROM alunos
WHERE nivel = 'iniciante';`,
  },
] as const;

type LayerId = (typeof layers)[number]["id"];

function sampleFor(layer: LayerId): string {
  switch (layer) {
    case "front":
    case "back":
    case "data": {
      const found = layers.find((item) => item.id === layer);
      return found?.code ?? "";
    }
    default: {
      const unknown: never = layer;
      return unknown;
    }
  }
}

export function HeroForge() {
  const reduced = usePrefersReducedMotion();
  const [layer, setLayer] = useState<LayerId>("front");

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduced) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--px", `${x * 10}px`);
    event.currentTarget.style.setProperty("--py", `${y * 8}px`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const index = layers.findIndex((item) => item.id === layer);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = layers[(index + direction + layers.length) % layers.length];
    if (!next) {
      return;
    }
    setLayer(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div className="forge" onMouseMove={onMove}>
      <div className="forge-kiln" aria-hidden="true">
        <span className="ember-core" />
        <ul className="pillar-orbit">
          <li>MERN</li>
          <li>MEAN</li>
          <li>LAMP</li>
          <li>.NET</li>
        </ul>
      </div>
      <div className="layer-switch" role="tablist" aria-label="Camadas do sistema" onKeyDown={onKeyDown}>
        {layers.map((item) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={layer === item.id}
            aria-controls="forge-code"
            aria-label={`${item.kicker}: ${item.label}`}
            tabIndex={layer === item.id ? 0 : -1}
            className={layer === item.id ? "is-active" : undefined}
            onClick={() => setLayer(item.id)}
          >
            <small>{item.kicker}</small>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
      <pre id="forge-code" className="forge-code" role="tabpanel" aria-live="polite">
        <code>{sampleFor(layer)}</code>
      </pre>
      <p className="forge-caption">Escolha uma camada. O código muda com ela.</p>
    </div>
  );
}
