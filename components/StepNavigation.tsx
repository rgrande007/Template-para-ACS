"use client";

interface StepNavigationProps {
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  onNavigate: (id: string) => void;
}

export default function StepNavigation({ previous, next, onNavigate }: StepNavigationProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-200 pt-6">
      <button
        type="button"
        onClick={() => previous && onNavigate(previous.id)}
        disabled={!previous}
        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-ink transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {previous ? `← ${previous.title}` : "← Anterior"}
      </button>
      <button
        type="button"
        onClick={() => next && onNavigate(next.id)}
        disabled={!next}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {next ? `${next.title} →` : "Concluído →"}
      </button>
    </div>
  );
}
