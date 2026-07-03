"use client";

import { AbstractData, CentralSentenceData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import { STEP_META } from "@/lib/formSchema";
import { buildAbstractParagraph } from "@/lib/generateMarkdown";

interface StepProps {
  data: AbstractData;
  onChange: (data: AbstractData) => void;
  centralSentence: CentralSentenceData;
}

export default function StepAbstract({ data, onChange, centralSentence }: StepProps) {
  const meta = STEP_META[3];
  const set = (field: keyof AbstractData) => (value: string) => onChange({ ...data, [field]: value });

  const preview = buildAbstractParagraph(data);
  const wordCount = preview.trim().length > 0 ? preview.trim().split(/\s+/).length : 0;

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox
        formula="Contexto + lacuna + estratégia + resultado + significado"
        example="Infecções hospitalares associadas a têxteis contaminados são um risco crescente. Métodos de síntese de nanopartículas antibacterianas usam reagentes tóxicos. Sintetizamos AgNPs com extrato de chá verde e revestimos tecido de algodão. As AgNPs inibiram 99% do crescimento bacteriano em 24h. Este método oferece uma rota sustentável para têxteis hospitalares antimicrobianos."
        example2="Catalisadores para oxidação de CO em baixa temperatura são essenciais para o controle de emissões veiculares. Catalisadores convencionais à base de platina perdem atividade abaixo de 200°C. Sintetizamos nanopartículas de paládio suportadas em TiO2 mesoporoso via impregnação úmida. O catalisador atingiu conversão de CO superior a 95% a 150°C, mantendo estabilidade por 100 horas. Este resultado oferece uma alternativa mais barata e eficiente aos catalisadores convencionais de platina."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      />

      <p className="mb-4 text-xs text-muted">
        <strong className="text-ink">Lembrete:</strong> o abstract precisa estar em inglês na versão final — pode
        escrever em português aqui e traduzir depois.
      </p>

      <FormField
        label="Contexto"
        helpText="Qual problema amplo motiva este estudo?"
        type="textarea"
        value={data.context}
        onChange={set("context")}
      />
      <FormField
        label="Lacuna"
        helpText="O que ainda não estava resolvido?"
        type="textarea"
        value={data.gap}
        onChange={set("gap")}
      />

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Estratégia</span>
        {centralSentence.strategy.trim() && (
          <button
            type="button"
            onClick={() => set("strategy")(centralSentence.strategy)}
            className="text-xs font-medium text-accent hover:underline"
          >
            Usar a mesma da Frase Central
          </button>
        )}
      </div>
      <span className="mb-2 block text-xs text-muted">O que está sendo feito (ou será feito) neste trabalho?</span>
      <FormField label="" type="textarea" value={data.strategy} onChange={set("strategy")} />

      <FormField
        label="Resultado"
        helpText="Qual é o resultado esperado (ou já obtido)? Inclua dados quantitativos quando possível — pode ser uma estimativa a ajustar depois."
        type="textarea"
        value={data.result}
        onChange={set("result")}
      />
      <FormField
        label="Significado"
        helpText="Por que esse resultado, se confirmado, importaria para o campo?"
        type="textarea"
        value={data.significance}
        onChange={set("significance")}
      />

      <div>
        <span className="mb-2 block text-sm font-semibold text-ink">Abstract completo (gerado)</span>
        <div className="rounded-lg border border-stone-300 bg-stone-50 p-4 text-sm leading-relaxed text-ink">
          {preview || <span className="text-muted">Preencha os campos acima para gerar o abstract.</span>}
        </div>
        <p className="mt-1 text-xs text-muted">
          {wordCount} palavras — a maioria dos periódicos ACS pede abstracts de até ~200 palavras. Confira o limite
          exato nas normas da revista escolhida.
        </p>
      </div>
    </StepCard>
  );
}
