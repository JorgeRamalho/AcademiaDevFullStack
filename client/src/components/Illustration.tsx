import type { ReactNode } from "react";
import type { IllustrationKind } from "../types";

const kinds = ["skeleton", "flex", "code", "types", "tree", "flow", "table", "stack", "lock"] as const;

export function isIllustrationKind(value: string): value is IllustrationKind {
  return kinds.some((kind) => kind === value);
}

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="figure">
      <svg viewBox="0 0 320 180" aria-hidden="true">
        {children}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function Illustration({ kind }: { kind: string }) {
  if (!isIllustrationKind(kind)) {
    return (
      <figure className="figure">
        <figcaption>Ilustração em preparação.</figcaption>
      </figure>
    );
  }

  switch (kind) {
    case "skeleton":
      return (
        <Frame caption="A página semântica: cabeçalho, miolo e rodapé.">
          <rect x="24" y="16" width="272" height="148" rx="16" fill="#0f1e34" stroke="#5a7aa8" />
          <rect x="40" y="32" width="88" height="12" rx="6" fill="#c2410c" />
          <rect x="40" y="56" width="240" height="64" rx="10" fill="#122a4a" stroke="#c2410c" />
          <rect x="40" y="132" width="240" height="12" rx="6" fill="#1a3358" />
        </Frame>
      );
    case "flex":
      return (
        <Frame caption="Três cartões na mesma fileira, alinhados pela altura.">
          <rect x="28" y="48" width="72" height="84" rx="12" fill="#1b6a56" />
          <rect x="124" y="36" width="72" height="108" rx="12" fill="#c2410c" />
          <rect x="220" y="60" width="72" height="60" rx="12" fill="#243044" />
        </Frame>
      );
    case "code":
      return (
        <Frame caption="Uma lista entra, outra lista sai, do mesmo tamanho.">
          <rect x="28" y="28" width="264" height="124" rx="14" fill="#1c1712" />
          <rect x="48" y="52" width="120" height="8" rx="4" fill="#f6efe4" />
          <rect x="48" y="72" width="180" height="8" rx="4" fill="#e7b39a" />
          <rect x="48" y="92" width="96" height="8" rx="4" fill="#8fd0bf" />
          <rect x="48" y="112" width="150" height="8" rx="4" fill="#f6efe4" />
        </Frame>
      );
    case "types":
      return (
        <Frame caption="Dois formatos possíveis. O valor ocupa um deles.">
          <circle cx="130" cy="90" r="46" fill="#fde7df" stroke="#c2410c" strokeWidth="3" />
          <circle cx="190" cy="90" r="46" fill="#e5f3ee" stroke="#1b6a56" strokeWidth="3" />
          <text x="112" y="96" fill="#ffffff" fontSize="18" fontFamily="Georgia, serif">
            Aa
          </text>
          <text x="176" y="96" fill="#ffffff" fontSize="18" fontFamily="Georgia, serif">
            12
          </text>
        </Frame>
      );
    case "tree":
      return (
        <Frame caption="O componente pede. O serviço busca. A tela mostra.">
          <rect x="110" y="22" width="100" height="36" rx="10" fill="#243044" />
          <path d="M160 58 V78 M160 78 H70 V96 M160 78 H250 V96" stroke="#1c1712" fill="none" strokeWidth="2" />
          <rect x="28" y="96" width="92" height="36" rx="10" fill="#c2410c" />
          <rect x="200" y="96" width="92" height="36" rx="10" fill="#1b6a56" />
        </Frame>
      );
    case "flow":
      return (
        <Frame caption="O pedido atravessa a tela, a API e o banco.">
          <rect x="16" y="68" width="58" height="40" rx="10" fill="#fffaf4" stroke="#1c1712" />
          <rect x="92" y="68" width="58" height="40" rx="10" fill="#fde7df" stroke="#c2410c" />
          <rect x="168" y="68" width="58" height="40" rx="10" fill="#e5f3ee" stroke="#1b6a56" />
          <rect x="244" y="68" width="58" height="40" rx="10" fill="#243044" />
          <path d="M74 88 H92 M150 88 H168 M226 88 H244" stroke="#1c1712" strokeWidth="2" />
        </Frame>
      );
    case "table":
      return (
        <Frame caption="Linhas, colunas e um filtro em volta de quem importa.">
          <rect x="36" y="28" width="248" height="124" rx="12" fill="#fffaf4" stroke="#1c1712" />
          <rect x="36" y="28" width="248" height="28" fill="#1b6a56" />
          <path d="M36 84 H284 M36 116 H284 M118 56 V152" stroke="#e7decd" />
          <rect x="128" y="92" width="140" height="16" rx="4" fill="#fde7df" />
        </Frame>
      );
    case "stack":
      return (
        <Frame caption="Quatro peças empilhadas, na ordem da sigla.">
          <rect x="48" y="28" width="224" height="26" rx="8" fill="#243044" />
          <rect x="48" y="62" width="224" height="26" rx="8" fill="#c2410c" />
          <rect x="48" y="96" width="224" height="26" rx="8" fill="#a56a22" />
          <rect x="48" y="130" width="224" height="26" rx="8" fill="#1b6a56" />
        </Frame>
      );
    case "lock":
      return (
        <Frame caption="A senha entra pela porta. No banco dorme só o hash.">
          <rect x="104" y="78" width="112" height="72" rx="16" fill="#1c1712" />
          <path d="M128 78 V62 a32 32 0 0 1 64 0 V78" fill="none" stroke="#c2410c" strokeWidth="8" />
          <circle cx="160" cy="112" r="8" fill="#f6efe4" />
        </Frame>
      );
    default: {
      const unknown: never = kind;
      return unknown;
    }
  }
}
