import type { ReactNode } from "react";

type ModuleCardProps = {
  title: string;
  meta?: string;
  description: string;
  accent?: string;
  children?: ReactNode;
};

export function ModuleCard({ title, meta, description, accent = "#caa24b", children }: ModuleCardProps) {
  return (
    <article className="group border border-white/10 bg-white/[0.035] p-4 shadow-glow transition hover:-translate-y-1 hover:border-white/20">
      <div className="mb-4 h-1 w-16" style={{ backgroundColor: accent }} />
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl text-white">{title}</h2>
        {meta ? <span className="shrink-0 rounded border border-white/10 px-2 py-1 text-xs text-white/50">{meta}</span> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-white/62">{description}</p>
      {children ? <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/58">{children}</div> : null}
    </article>
  );
}
