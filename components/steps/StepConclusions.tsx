"use client";

import { ConclusionsData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import FormulaSubBlock from "@/components/FormulaSubBlock";
import { STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: ConclusionsData;
  onChange: (data: ConclusionsData) => void;
}

export default function StepConclusions({ data, onChange }: StepProps) {
  const meta = STEP_META[7];
  const set = (field: keyof ConclusionsData) => (value: string) => onChange({ ...data, [field]: value });

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox formula="[Resposta] + [Evidência] + [Significado] + [Limite] + [Próximo passo]. A conclusão faz o movimento inverso da introdução: começa na resposta específica e termina no significado mais amplo." />

      <FormulaSubBlock
        heading="Parágrafo 1, resposta do paper"
        fn="responder diretamente à pergunta científica do artigo."
        formula="Os resultados demonstram que [resposta principal], como evidenciado por [principais dados]."
        example="Os resultados demonstram que nanopartículas de prata sintetizadas via rota verde revestem tecido de algodão e inibem o crescimento bacteriano, como evidenciado pela redução de 99% na viabilidade de S. aureus e E. coli."
        example2="Os resultados demonstram que nanopartículas de paládio suportadas em TiO2 mesoporoso catalisam eficientemente a oxidação de CO em baixas temperaturas, como evidenciado pela conversão superior a 95% a 150°C."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      >
        <FormField
          label="Qual é a resposta esperada (ou já obtida)?"
          type="textarea"
          value={data.mainAnswer}
          onChange={set("mainAnswer")}
        />
        <FormField
          label="Quais dados vão sustentar (ou já sustentam) essa resposta?"
          type="textarea"
          value={data.supportingData}
          onChange={set("supportingData")}
        />
      </FormulaSubBlock>

      <FormulaSubBlock
        heading="Parágrafo 2, significado do trabalho"
        fn="mostrar por que o resultado importa."
        formula="Esses achados indicam que [significado para o campo], embora [limitação]. O próximo passo é [desdobramento futuro]."
        example="Esses achados indicam que a síntese verde é uma alternativa viável a métodos químicos tóxicos, embora a estabilidade do revestimento após lavagens repetidas ainda precise ser testada. O próximo passo é avaliar a durabilidade do tecido em condições de uso hospitalar real."
        example2="Esses achados indicam que catalisadores de Pd suportado são uma alternativa viável e mais barata aos sistemas convencionais de platina, embora a resistência ao envenenamento por enxofre ainda precise ser avaliada. O próximo passo é testar o catalisador sob condições reais de exaustão veicular."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      >
        <FormField
          label="O que esses resultados, se confirmados, mudariam no campo?"
          type="textarea"
          value={data.fieldChange}
          onChange={set("fieldChange")}
        />
        <FormField label="Qual limitação deve ser reconhecida?" type="textarea" value={data.limitation} onChange={set("limitation")} />
        <FormField label="Qual é o próximo passo lógico?" type="textarea" value={data.nextStep} onChange={set("nextStep")} />
      </FormulaSubBlock>
    </StepCard>
  );
}
