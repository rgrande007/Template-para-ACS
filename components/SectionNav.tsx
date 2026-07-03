"use client";

import SectionIcon from "@/components/SectionIcon";

interface SectionNavProps {
  sections: { id: string; title: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  completion?: Record<string, number>;
}

function SectionStatusIcon({ ratio }: { ratio?: number }) {
  if (ratio === undefined) return null;
  if (ratio >= 1) {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" className="shrink-0 text-green-600" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path d="M4.5 8.2 7 10.7l4.5-5.4" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (ratio > 0) {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" className="shrink-0 text-amber-600" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 1.75A6.25 6.25 0 0 1 8 14.25Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" className="shrink-0 text-stone-300" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function statusLabel(ratio?: number): string {
  if (ratio === undefined) return "";
  if (ratio >= 1) return " — seção completa";
  if (ratio > 0) return " — seção parcialmente preenchida";
  return " — seção ainda vazia";
}

export default function SectionNav({ sections, activeId, onSelect, completion }: SectionNavProps) {
  return (
    <nav className="border-b border-stone-200 bg-paper px-4 py-2 sm:px-6" aria-label="Navegação entre seções">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="flex flex-1 gap-1 overflow-x-auto">
          {sections.map((section) => {
            const sectionRatio = completion?.[section.id];
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${section.title}${statusLabel(sectionRatio)}`}
                title={section.title}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  isActive ? "bg-accent text-white" : "text-muted hover:bg-stone-100 hover:text-ink"
                }`}
              >
                <SectionIcon id={section.id} className="shrink-0" />
                <span>{section.title}</span>
                {!isActive && <SectionStatusIcon ratio={sectionRatio} />}
              </button>
            );
          })}
        </div>
        <div className="hidden shrink-0 items-center gap-2.5 text-[10px] text-muted lg:flex" aria-hidden="true">
          <span className="flex items-center gap-1">
            <SectionStatusIcon ratio={0} /> vazia
          </span>
          <span className="flex items-center gap-1">
            <SectionStatusIcon ratio={0.5} /> parcial
          </span>
          <span className="flex items-center gap-1">
            <SectionStatusIcon ratio={1} /> completa
          </span>
        </div>
      </div>
    </nav>
  );
}
