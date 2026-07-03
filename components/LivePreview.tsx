"use client";

import { PaperFormData } from "@/types/paper";
import { buildAbstractParagraph, buildConclusionParagraphs, buildFigureParagraph } from "@/lib/generateMarkdown";

interface LivePreviewProps {
  data: PaperFormData;
}

function Placeholder({ text }: { text: string }) {
  return <span className="italic text-stone-400">{text}</span>;
}

function Paragraph({ text, placeholder }: { text: string; placeholder: string }) {
  return (
    <p className="mb-3 text-justify indent-6 leading-relaxed">
      {text ? text : <Placeholder text={placeholder} />}
    </p>
  );
}

function RunInHeading({ label, text }: { label: string; text: string }) {
  return (
    <p className="mb-3 text-justify leading-relaxed">
      <span className="font-bold italic">{label}. </span>
      {text ? text : <Placeholder text="ainda não preenchido" />}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-7 text-base font-bold first:mt-0">{children}</h3>;
}

export default function LivePreview({ data }: LivePreviewProps) {
  const abstractParagraph = buildAbstractParagraph(data.abstract);
  const introParagraphs = [
    data.introduction.paragraph1Context,
    data.introduction.paragraph2StateOfArt,
    data.introduction.paragraph3Gap,
    data.introduction.paragraph4Objective,
  ].filter((p) => p.trim().length > 0);
  const conclusionParagraphs = buildConclusionParagraphs(data);
  const siItems = [
    ["Protocolos e reprodutibilidade", data.supportingInfo.protocolsAndReproducibility],
    ["Figuras, espectros e tabelas complementares", data.supportingInfo.additionalFiguresAndData],
    ["Controles e dados estatísticos adicionais", data.supportingInfo.controlsAndStatistics],
  ].filter(([, value]) => value.trim().length > 0) as [string, string][];

  return (
    <article className="font-serif text-[0.95rem] text-ink">
      <p className="mb-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent/70">
        ACS Article · Rascunho
      </p>
      <h2 className="mb-4 text-center text-xl font-bold leading-snug text-balance">
        {data.title.finalTitle || <Placeholder text="Título provisório do paper" />}
      </h2>

      <div className="mb-6 border-y border-stone-200 py-4">
        <p className="mb-1 text-center text-xs font-bold uppercase tracking-wide text-muted">Abstract</p>
        <p className="text-justify text-sm italic leading-relaxed">
          {abstractParagraph || <Placeholder text="O abstract aparecerá aqui conforme você preenche a etapa Abstract." />}
        </p>
      </div>

      <SectionHeading>Introduction</SectionHeading>
      {introParagraphs.length > 0 ? (
        introParagraphs.map((p, i) => <Paragraph key={i} text={p} placeholder="" />)
      ) : (
        <Paragraph text="" placeholder="A introdução aparecerá aqui conforme você preenche os quatro parágrafos." />
      )}

      <SectionHeading>Experimental Section</SectionHeading>
      <RunInHeading label="Materials" text={data.methods.materials} />
      <RunInHeading label="Sample Preparation" text={data.methods.preparation} />
      <RunInHeading label="Characterization" text={data.methods.characterization} />
      <RunInHeading label="Controls" text={data.methods.controls} />

      <SectionHeading>Results and Discussion</SectionHeading>
      {data.results.figures.map((figure, index) => {
        const num = index + 1;
        const paragraph = buildFigureParagraph(figure, num);
        return (
          <p key={figure.id} className="mb-3 text-justify indent-6 leading-relaxed">
            <span className="font-bold italic">Figure {num}. </span>
            {paragraph ? paragraph : <Placeholder text={`ainda não preenchido — veja a Figura ${num} no formulário.`} />}
          </p>
        );
      })}

      <SectionHeading>Conclusions</SectionHeading>
      <Paragraph text={conclusionParagraphs.mainAnswer} placeholder="A resposta principal do artigo aparecerá aqui." />
      <Paragraph text={conclusionParagraphs.broaderMeaning} placeholder="O significado mais amplo dos resultados aparecerá aqui." />

      <SectionHeading>Supporting Information</SectionHeading>
      {siItems.length > 0 ? (
        <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed">
          {siItems.map(([label, value]) => (
            <li key={label}>
              <span className="font-semibold">{label}:</span> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">
          <Placeholder text="Os itens complementares aparecerão aqui." />
        </p>
      )}
    </article>
  );
}
