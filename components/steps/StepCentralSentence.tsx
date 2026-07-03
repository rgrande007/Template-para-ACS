"use client";

import { CentralSentenceData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import { STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: CentralSentenceData;
  onChange: (data: CentralSentenceData) => void;
}

export default function StepCentralSentence({ data, onChange }: StepProps) {
  const meta = STEP_META[1];
  const set = (field: keyof CentralSentenceData) => (value: string) =>
    onChange({ ...data, [field]: value });

  const suggestion = `Este trabalho demonstra que ${data.system || "[sistema]"} pode ${
    data.strategy || "[estratégia]"
  }, resultando em ${data.mainFinding || "[descoberta principal]"}.`;

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox
        formula="Este trabalho demonstra que [sistema] pode [estratégia], resultando em [descoberta principal]."
        example="Este trabalho demonstra que nanopartículas de prata sintetizadas com extrato de chá verde podem revestir tecido de algodão via impregnação simples, resultando em inibição de 99% do crescimento bacteriano."
        example2="Este trabalho demonstra que nanopartículas de paládio suportadas em TiO2 mesoporoso podem catalisar seletivamente a oxidação de CO em baixas temperaturas, resultando em conversão superior a 95% a 150°C."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      />

      <p className="mb-4 text-xs text-muted">
        <strong className="text-ink">Idioma:</strong> pode escrever em português daqui pra frente, se ajudar a
        organizar as ideias. Os títulos de seção do Markdown final seguem o padrão ACS em inglês, mas o texto que
        você escrever também vai precisar estar em inglês antes da submissão.
      </p>

      <FormField
        label="Qual sistema você está estudando (ou pretende estudar)?"
        type="textarea"
        rows={2}
        value={data.system}
        onChange={set("system")}
      />
      <FormField
        label="Qual é a estratégia principal, planejada ou já em execução?"
        type="textarea"
        rows={2}
        value={data.strategy}
        onChange={set("strategy")}
      />
      <FormField
        label="Qual resultado você espera encontrar (ou já encontrou)?"
        helpText="Se ainda não tem os dados, escreva sua hipótese — você poderá ajustar esta frase depois."
        type="textarea"
        rows={2}
        value={data.mainFinding}
        onChange={set("mainFinding")}
      />

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Frase central do paper</span>
        <button
          type="button"
          onClick={() => onChange({ ...data, centralSentence: suggestion })}
          className="text-xs font-medium text-accent hover:underline"
        >
          Usar sugestão
        </button>
      </div>
      <FormField
        label=""
        type="textarea"
        rows={3}
        value={data.centralSentence}
        onChange={set("centralSentence")}
        placeholder={suggestion}
      />
    </StepCard>
  );
}
