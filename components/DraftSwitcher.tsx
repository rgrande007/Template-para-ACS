"use client";

import { useEffect, useRef, useState } from "react";
import { DraftMeta } from "@/lib/drafts";

interface DraftSwitcherProps {
  drafts: DraftMeta[];
  activeDraftId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function DraftSwitcher({ drafts, activeDraftId, onSwitch, onCreate, onRename, onDelete }: DraftSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeDraft = drafts.find((d) => d.id === activeDraftId);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-stone-100"
      >
        <span className="max-w-[10rem] truncate">{activeDraft?.name ?? "Rascunho"}</span>
        <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M5.5 7.5 10 12l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Meus rascunhos"
          className="absolute left-0 top-full z-30 mt-1 w-72 rounded-lg border border-stone-200 bg-white p-1.5 shadow-lg"
        >
          <div className="max-h-64 overflow-y-auto">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                role="option"
                aria-selected={draft.id === activeDraftId}
                className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm ${
                  draft.id === activeDraftId ? "bg-accent/10" : "hover:bg-stone-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSwitch(draft.id);
                    setOpen(false);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className={`block truncate font-medium ${draft.id === activeDraftId ? "text-accent" : "text-ink"}`}>
                    {draft.name}
                  </span>
                  <span className="block text-[11px] text-muted">Atualizado em {formatUpdatedAt(draft.updatedAt)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRename(draft.id)}
                  title="Renomear rascunho"
                  aria-label={`Renomear ${draft.name}`}
                  className="shrink-0 rounded p-1 text-muted opacity-0 hover:bg-stone-200 hover:text-ink group-hover:opacity-100"
                >
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M13.5 3.5 16.5 6.5 7 16H4v-3Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {drafts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDelete(draft.id)}
                    title="Excluir rascunho"
                    aria-label={`Excluir ${draft.name}`}
                    className="shrink-0 rounded p-1 text-muted opacity-0 hover:bg-red-100 hover:text-red-700 group-hover:opacity-100"
                  >
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M4.5 6h11M8 6V4.5h4V6M6 6l.6 9.5a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L14 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onCreate();
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-accent hover:bg-accent/10"
          >
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 4.5v11M4.5 10h11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Novo rascunho
          </button>
        </div>
      )}
    </div>
  );
}
