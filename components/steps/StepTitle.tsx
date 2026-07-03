"use client";

import { CentralSentenceData, TitleData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import { STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: TitleData;
  onChange: (data: TitleData) => void;
  centralSentence: CentralSentenceData;
}

export default function StepTitle({ data, onChange, centralSentence }: StepProps) {
  const meta = STEP_META[2];
  const set = (field: keyof TitleData) => (value: string) => onChange({ ...data, [field]: value });

  const suggestion = [centralSentence.system, centralSentence.strategy, centralSentence.mainFinding]
    .filter((v) => v.trim().length > 0)
    .join(": ");

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox
        formula="[Sistema] + [ação científica] + [resultado central]"
        example="Nanopartículas de Prata Biossintetizadas: Revestimento de Tecido de Algodão com Atividade Antibacteriana de Amplo Espectro"
        example2="Nanopartículas de Paládio em TiO2 Mesoporoso: Oxidação Seletiva de CO com Alta Atividade em Baixa Temperatura"
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      />

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Título provisório</span>
        {suggestion && (
          <button
            type="button"
            onClick={() => onChange({ ...data, finalTitle: suggestion })}
            className="text-xs font-medium text-accent hover:underline"
          >
            Usar sugestão a partir da Frase Central
          </button>
        )}
      </div>
      <FormField
        label=""
        helpText="Use a fórmula acima como guia. Se preferir, reaproveite o sistema/estratégia/resultado que você já escreveu na Frase Central."
        value={data.finalTitle}
        onChange={set("finalTitle")}
        placeholder={suggestion || "Título final do paper"}
      />
      <p className="mt-1 text-xs text-muted">
        {data.finalTitle.trim().length} caracteres — a maioria dos periódicos ACS recomenda títulos abaixo de ~150
        caracteres. Confira o limite exato nas normas da revista escolhida.
      </p>
    </StepCard>
  );
}
