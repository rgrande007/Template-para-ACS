"use client";

import { FigureData, ResultsData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import { STEP_META, createEmptyFigure } from "@/lib/formSchema";

interface StepProps {
  data: ResultsData;
  onChange: (data: ResultsData) => void;
}

const FIGURE_OPTIONS = [1, 2, 3, 4, 5, 6];

function figureHasContent(figure: FigureData): boolean {
  return Object.values(figure).some((value, index) => index > 0 && value.trim().length > 0);
}

export default function StepResults({ data, onChange }: StepProps) {
  const meta = STEP_META[6];

  const handleCountChange = (count: number) => {
    const figures = [...data.figures];
    if (count > figures.length) {
      for (let i = figures.length; i < count; i += 1) {
        figures.push(createEmptyFigure(i + 1));
      }
    } else {
      const removed = figures.slice(count);
      if (removed.some(figureHasContent)) {
        const confirmed = window.confirm(
          `As respostas preenchidas nas Figuras ${count + 1} a ${figures.length} serão perdidas. Deseja continuar?`
        );
        if (!confirmed) return;
      }
      figures.length = count;
    }
    onChange({ numberOfFigures: count, figures });
  };

  const updateFigure = (index: number, field: keyof FigureData) => (value: string) => {
    const figures = data.figures.map((fig, i) => (i === index ? { ...fig, [field]: value } : fig));
    onChange({ ...data, figures });
  };

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox
        formula="Pergunta da figura + observação (com a evidência que a sustenta) + interpretação + ponte. A seção é organizada por figuras principais."
        example="Atomic sentence: A Figura 1 mostra que o revestimento com nanopartículas de prata reduz em mais de 99% a viabilidade de S. aureus e E. coli após 24h. Observação: halos de inibição maiores no tecido tratado, em comparação com o controle de tecido não tratado e com tecido tratado apenas com extrato de chá. Interpretação: a atividade antibacteriana vem das nanopartículas, não do extrato isoladamente. Ponte: isso levanta a questão de quão estável é esse efeito após lavagens, respondida na Figura 2."
        example2="Atomic sentence: A Figura 1 mostra que o catalisador de Pd/TiO2 atinge conversão de CO superior a 95% já a 150°C, temperatura muito abaixo do catalisador comercial de referência. Observação: curva de conversão de CO em função da temperatura, comparando Pd/TiO2 com o TiO2 puro (sem atividade) e com o catalisador comercial de Pt/Al2O3 (T50 mais alta). Interpretação: a alta dispersão das nanopartículas de Pd no suporte mesoporoso aumenta a densidade de sítios ativos disponíveis para adsorção de CO. Ponte: isso levanta a questão sobre a estabilidade desse desempenho ao longo do tempo, respondida na Figura 2."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      />

      <div className="mb-6">
        <span className="mb-2 block text-sm font-semibold text-ink">Número de figuras principais</span>
        <div className="flex flex-wrap gap-2">
          {FIGURE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleCountChange(n)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                data.numberOfFigures === n
                  ? "bg-accent text-white"
                  : "bg-stone-100 text-ink hover:bg-stone-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {data.figures.map((figure, index) => {
        const num = index + 1;
        return (
          <div key={figure.id} className="mb-8 rounded-lg border border-stone-200 p-4">
            <h3 className="mb-3 font-serif text-lg font-semibold text-ink">Figura {num}</h3>

            <FormField
              label={`Atomic sentence — A Figura ${num} mostra que...`}
              helpText="Qual pergunta científica esta figura vai responder (ou já respondeu)? Se ainda não tem o dado, escreva o resultado que você espera — essa é a mensagem principal da figura."
              type="textarea"
              rows={2}
              value={figure.atomicSentence}
              onChange={updateFigure(index, "atomicSentence")}
            />
            <FormField
              label="Observação principal"
              helpText="O que a figura vai mostrar (ou já mostra) objetivamente, e com que controle ou comparação? (ex.: 'halos maiores no tecido tratado, frente ao controle não tratado')"
              type="textarea"
              rows={2}
              value={figure.mainObservation}
              onChange={updateFigure(index, "mainObservation")}
            />
            <FormField
              label="Interpretação"
              helpText="O que esse resultado significaria (ou significa) cientificamente?"
              type="textarea"
              rows={2}
              value={figure.interpretation}
              onChange={updateFigure(index, "interpretation")}
            />
            <FormField
              label="Ponte"
              helpText="Como esse resultado leva à próxima figura ou à conclusão?"
              type="textarea"
              rows={2}
              value={figure.bridge}
              onChange={updateFigure(index, "bridge")}
            />
          </div>
        );
      })}
    </StepCard>
  );
}
