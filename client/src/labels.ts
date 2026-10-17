import type { Level, Pillar, ToolLayer } from "./types";

export const SITE_NAME = "Academia DEVFullStack";
export const SITE_HOME_TITLE = `${SITE_NAME} — Portal de estudos Full Stack`;

export function levelLabel(level: Level): string {
  switch (level) {
    case "iniciante":
      return "Iniciante";
    case "intermediario":
      return "Intermediário";
    case "avancado":
      return "Avançado";
    default: {
      const unknown: never = level;
      return unknown;
    }
  }
}

export const PILLAR_ORDER: readonly Pillar[] = ["mern", "mean", "lamp", "dotnet"];

export function sortByPillarOrder<T extends { slug: Pillar }>(items: T[]): T[] {
  const rank = new Map(PILLAR_ORDER.map((slug, index) => [slug, index]));
  return [...items].sort((a, b) => (rank.get(a.slug) ?? 0) - (rank.get(b.slug) ?? 0));
}

export type HomePillarCard = {
  slug: Pillar;
  name: string;
  stack: string;
  summary: string;
};

/** Texto exibido na seção Pilares da home (ordem MERN → MEAN → LAMP → .NET). */
export const HOME_PILLAR_CARDS: HomePillarCard[] = [
  {
    slug: "mern",
    name: "MERN",
    stack: "MongoDB · Express · React · Node.js",
    summary:
      "Uma linguagem só, do botão ao documento. A tela em React, a API em Express e Node.js, os dados em MongoDB, unificando ambos front-end e o back-end.",
  },
  {
    slug: "mean",
    name: "MEAN",
    stack: "MongoDB · Express · Angular · Node.js",
    summary:
      "Representa um conjunto de tecnologias baseadas em JavaScript, a mesma ponte do MERN, com Angular e TypeScript conduzindo a interface.",
  },
  {
    slug: "lamp",
    name: "LAMP",
    stack: "Linux · Apache · MySQL · PHP",
    summary:
      "O clássico que ainda sustenta boa parte da web: sistema, servidor, tabela e página. Representa um dos conjuntos de software (stack) mais tradicionais e utilizados do mundo.",
  },
  {
    slug: "dotnet",
    name: ".NET",
    stack: "C# · ASP.NET · SQL",
    summary:
      "Tipagem forte, APIs organizadas e banco relacional. Um pilar estável para sistema que cresce. A melhor opção para construir sistemas corporativos e crescer com estabilidade.",
  },
];

export function pillarLabel(pillar: Pillar): string {
  switch (pillar) {
    case "mern":
      return "MERN";
    case "mean":
      return "MEAN";
    case "lamp":
      return "LAMP";
    case "dotnet":
      return ".NET";
    default: {
      const unknown: never = pillar;
      return unknown;
    }
  }
}

export function layerLabel(layer: ToolLayer): string {
  switch (layer) {
    case "front":
      return "Front-end";
    case "back":
      return "Back-end";
    case "data":
      return "Banco de dados";
    case "infra":
      return "Infraestrutura";
    default: {
      const unknown: never = layer;
      return unknown;
    }
  }
}

export function firstName(name: string): string {
  const [first] = name.trim().split(/\s+/);
  return first ?? name;
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

const layers: ToolLayer[] = ["front", "back", "data", "infra"];

export function isToolLayer(value: string): value is ToolLayer {
  return layers.some((layer) => layer === value);
}
