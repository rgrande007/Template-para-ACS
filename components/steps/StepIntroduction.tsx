"use client";

import { CentralSentenceData, IntroductionData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import FormulaSubBlock from "@/components/FormulaSubBlock";
import { STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: IntroductionData;
  onChange: (data: IntroductionData) => void;
  centralSentence: CentralSentenceData;
}

export default function StepIntroduction({ data, onChange, centralSentence }: StepProps) {
  const meta = STEP_META[4];
  const set = (field: keyof IntroductionData) => (value: string) => onChange({ ...data, [field]: value });

  const objectiveSuggestion = `Neste trabalho, nós investigamos ${centralSentence.system || "[sistema]"} usando ${
    centralSentence.strategy || "[estratégia]"
  } para demonstrar ${centralSentence.mainFinding || "[contribuição central]"}.`;

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox formula="Área ampla + estado da arte + lacuna + objetivo. A introdução deve afunilar: começa no campo amplo e termina na contribuição específica do trabalho." />

      <FormulaSubBlock
        heading="Parágrafo 1, contexto"
        fn="mostrar em qual área o trabalho se insere e por que essa área importa."
        formula="[Área] é importante porque [problema ou oportunidade]."
        example="Têxteis hospitalares antimicrobianos são importantes porque infecções associadas a superfícies contaminadas continuam entre as principais causas de morbidade hospitalar."
        example2="Catalisadores para controle de emissões veiculares são importantes porque a oxidação incompleta de CO em motores de combustão contribui significativamente para a poluição urbana."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      >
        <FormField
          label="Qual é a grande área do trabalho e por que ela importa?"
          type="textarea"
          value={data.paragraph1Context}
          onChange={set("paragraph1Context")}
        />
      </FormulaSubBlock>

      <FormulaSubBlock
        heading="Parágrafo 2, estado da arte"
        fn="mostrar o que a literatura já estabeleceu."
        formula="Estudos anteriores mostraram que [conhecimento já estabelecido]."
        example="Estudos anteriores mostraram que nanopartículas de prata têm forte atividade antibacteriana de amplo espectro."
        example2="Estudos anteriores mostraram que catalisadores à base de platina e paládio são altamente ativos para a oxidação de CO em temperaturas elevadas."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      >
        <FormField
          label="O que a literatura já mostrou sobre esse tema?"
          type="textarea"
          value={data.paragraph2StateOfArt}
          onChange={set("paragraph2StateOfArt")}
        />
      </FormulaSubBlock>

      <FormulaSubBlock
        heading="Parágrafo 3, lacuna"
        fn="mostrar o que ainda falta resolver."
        formula="Apesar de [avanço existente], ainda falta entender, controlar ou demonstrar [lacuna]."
        example="Apesar do amplo uso de nanopartículas de prata, ainda falta demonstrar métodos de síntese seguros o suficiente para aplicação direta em têxteis hospitalares."
        example2="Apesar da alta atividade desses catalisadores em altas temperaturas, ainda falta demonstrar formulações estáveis e ativas em baixas temperaturas de partida a frio do motor."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      >
        <FormField
          label="O que ainda falta entender, controlar ou demonstrar?"
          type="textarea"
          value={data.paragraph3Gap}
          onChange={set("paragraph3Gap")}
        />
      </FormulaSubBlock>

      <FormulaSubBlock
        heading="Parágrafo 4, objetivo"
        fn="dizer exatamente o que este projeto faz (ou fará) para resolver a lacuna."
        formula="Neste trabalho, nós investigamos [sistema] usando [estratégia] para demonstrar [contribuição central]."
        example="Neste trabalho, nós investigamos a síntese verde de nanopartículas de prata usando extrato de chá verde para demonstrar revestimento antibacteriano sustentável em tecido de algodão."
        example2="Neste trabalho, nós investigamos nanopartículas de paládio suportadas em TiO2 mesoporoso usando impregnação úmida controlada para demonstrar oxidação eficiente de CO em baixas temperaturas."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">O que este trabalho faz (ou pretende fazer) para resolver essa lacuna?</span>
          {(centralSentence.system.trim() || centralSentence.strategy.trim() || centralSentence.mainFinding.trim()) && (
            <button
              type="button"
              onClick={() => set("paragraph4Objective")(objectiveSuggestion)}
              className="text-xs font-medium text-accent hover:underline"
            >
              Usar sugestão
            </button>
          )}
        </div>
        <FormField label="" type="textarea" value={data.paragraph4Objective} onChange={set("paragraph4Objective")} />
      </FormulaSubBlock>
    </StepCard>
  );
}
