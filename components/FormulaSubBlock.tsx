"use client";

import { ReactNode, useState } from "react";
import FormulaText from "@/components/FormulaText";

interface FormulaSubBlockProps {
  heading: string;
  fn: string;
  formula: string;
  example?: string;
  example2?: string;
  exampleLabel?: string;
  example2Label?: string;
  children: ReactNode;
}

export default function FormulaSubBlock({
  heading,
  fn,
  formula,
  example,
  example2,
  exampleLabel = "Exemplo 1",
  example2Label = "Exemplo 2",
  children,
}: FormulaSubBlockProps) {
  const [showExample, setShowExample] = useState(false);
  const [activeExample, setActiveExample] = useState<1 | 2>(1);
  const hasSecondExample = Boolean(example2);
  const shownExample = activeExample === 2 && example2 ? example2 : example;

  return (
    <div className="mb-6 rounded-lg border border-stone-200 p-4">
      <h3 className="mb-1 text-sm font-bold text-ink">{heading}</h3>
      <p className="mb-2 text-xs text-muted">Função: {fn}</p>
      <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs italic leading-7 text-amber-900">
        <FormulaText formula={formula} />
      </p>
      {example && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowExample((prev) => !prev)}
            className="text-xs font-medium text-accent hover:underline"
          >
            {showExample ? "Ocultar exemplo" : "Ver exemplo preenchido"}
          </button>
          {showExample && (
            <div className="mt-1.5">
              {hasSecondExample && (
                <div className="mb-1.5 flex gap-1.5" role="tablist" aria-label="Escolher exemplo">
                  {[
                    { id: 1 as const, label: exampleLabel },
                    { id: 2 as const, label: example2Label },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeExample === tab.id}
                      onClick={() => setActiveExample(tab.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                        activeExample === tab.id
                          ? "bg-accent text-white"
                          : "bg-stone-100 text-ink hover:bg-stone-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="rounded-md bg-stone-50 p-2.5 text-xs italic text-ink">{shownExample}</p>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
