import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({ eyebrow = "ILGE Arsivi", title, description, children }: PageShellProps) {
  return (
    <main className="min-h-screen px-4 pb-28 pt-6 sm:px-6 lg:ml-72 lg:px-10 lg:pb-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-brass">{eyebrow}</p>
          <h1 className="font-display text-4xl text-white md:text-6xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62 md:text-base">{description}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
