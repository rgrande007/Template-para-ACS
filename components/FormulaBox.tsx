"use client";

import { useState } from "react";
import FormulaText from "@/components/FormulaText";

interface FormulaBoxProps {
  formula: string;
  example?: string;
  example2?: string;
  exampleLabel?: string;
  example2Label?: string;
}

export default function FormulaBox({
  formula,
  example,
  example2,
  exampleLabel = "Exemplo 1",
  example2Label = "Exemplo 2",
}: FormulaBoxProps) {
  const [showExample, setShowExample] = useState(false);
  const [activeExample, setActiveExample] = useState<1 | 2>(1);
  const hasSecondExample = Boolean(example2);
  const shownExample = activeExample === 2 && example2 ? example2 : example;

  return (
    <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Fórmula</p>
      <p className="italic leading-8">
        <FormulaText formula={formula} />
      </p>
      {example && (
        <div className="mt-1.5">
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
                          : "bg-white/70 text-amber-900 hover:bg-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="rounded-md bg-white/70 p-2.5 text-xs italic text-ink">{shownExample}</p>
              {hasSecondExample && (
                <p className="mt-1 text-[11px] text-amber-800">
                  A mesma fórmula funciona para os dois sistemas — adapte para o seu.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
