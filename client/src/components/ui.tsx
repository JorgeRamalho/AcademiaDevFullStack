
import type { CSSProperties } from "react";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  text?: string;
};

export function accentStyle(color: string): CSSProperties {
  return { "--accent": color } as CSSProperties;
}

export function cssVars(variables: Record<`--${string}`, string>): CSSProperties {
  return variables as CSSProperties;
}

export function SectionHeading({ index, eyebrow, title, text }: SectionHeadingProps) {
  return (
    <header className="section-head">
      <p className="index-num">{index}</p>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
    </header>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <p className="status" role="status">
      {label}
    </p>
  );
}

export function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="status status-error" role="alert">
      <p>{message}</p>
      <button type="button" className="button button-ghost" onClick={onRetry}>
        Tentar de novo
      </button>
    </div>
  );
}

export function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="prose">
      {paragraphs.map((paragraph, index) =>
        paragraph.startsWith("Código:") ? (
          <pre key={`${index}-${paragraph.slice(0, 12)}`}>
            <code>{paragraph.slice("Código:".length).trim()}</code>
          </pre>
        ) : (
          <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
        ),
      )}
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {text ? <p className="deck">{text}</p> : null}
    </header>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

