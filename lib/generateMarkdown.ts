import { AbstractData, PaperFormData } from "@/types/paper";

const fallback = (value: string, placeholder: string) =>
  value && value.trim().length > 0 ? value.trim() : `_${placeholder}_`;

export function buildAbstractParagraph(abstract: AbstractData): string {
  const { context, gap, strategy, result, significance } = abstract;
  const parts = [context, gap, strategy, result, significance]
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length > 0 ? parts.join(" ") : "";
}

export function buildFigureParagraph(figure: {
  mainObservation: string;
  interpretation: string;
  bridge: string;
}, figureNumber: number): string {
  const { mainObservation, interpretation, bridge } = figure;
  if (!mainObservation && !interpretation && !bridge) return "";
  return `A Figura ${figureNumber} mostra ${
    mainObservation || "[observação, com a comparação ou controle que a sustenta]"
  }. Isso significa que ${interpretation || "[interpretação científica]"}. Esse resultado leva à próxima etapa porque ${
    bridge || "[ponte]"
  }.`;
}

export function buildConclusionParagraphs(data: PaperFormData): { mainAnswer: string; broaderMeaning: string } {
  const { mainAnswer, supportingData, fieldChange, limitation, nextStep } = data.conclusions;

  const mainAnswerParagraph = mainAnswer
    ? `Os resultados demonstram que ${mainAnswer}, como evidenciado por ${supportingData || "[dados]"}.`
    : "";

  const broaderMeaningParagraph = fieldChange
    ? `Esses achados indicam que ${fieldChange}, embora ${limitation || "[limitação]"}. O próximo passo é ${
        nextStep || "[próximo passo]"
      }.`
    : "";

  return { mainAnswer: mainAnswerParagraph, broaderMeaning: broaderMeaningParagraph };
}

export function generateMarkdown(data: PaperFormData): string {
  const abstractParagraph = buildAbstractParagraph(data.abstract);
  const lines: string[] = [];

  lines.push(`# ${fallback(data.title.finalTitle, "Título provisório")}`, "");

  lines.push("# Abstract", "");
  lines.push(fallback(abstractParagraph, "Abstract ainda não preenchido"), "");

  lines.push("# Introduction", "");
  lines.push("## Paragraph 1, Context", "");
  lines.push(fallback(data.introduction.paragraph1Context, "não preenchido"), "");
  lines.push("## Paragraph 2, State of the Art", "");
  lines.push(fallback(data.introduction.paragraph2StateOfArt, "não preenchido"), "");
  lines.push("## Paragraph 3, Gap", "");
  lines.push(fallback(data.introduction.paragraph3Gap, "não preenchido"), "");
  lines.push("## Paragraph 4, Objective", "");
  lines.push(fallback(data.introduction.paragraph4Objective, "não preenchido"), "");

  lines.push("# Experimental Section", "");
  lines.push("## Materials", "");
  lines.push(fallback(data.methods.materials, "não preenchido"), "");
  lines.push("## Sample Preparation", "");
  lines.push(fallback(data.methods.preparation, "não preenchido"), "");
  lines.push("## Characterization", "");
  lines.push(fallback(data.methods.characterization, "não preenchido"), "");
  lines.push("## Controls", "");
  lines.push(fallback(data.methods.controls, "não preenchido"), "");

  lines.push("# Results and Discussion", "");
  data.results.figures.forEach((figure, index) => {
    const num = index + 1;
    lines.push(`## Figure ${num}`, "");
    lines.push("Atomic sentence:", "");
    lines.push(fallback(figure.atomicSentence, "não preenchido"), "");
    lines.push("Paragraph:", "");
    lines.push(
      fallback(
        buildFigureParagraph(figure, num),
        "não preenchido"
      ),
      ""
    );
  });

  lines.push("# Conclusions", "");
  const conclusionParagraphs = buildConclusionParagraphs(data);
  lines.push("## Paragraph 1, Main Answer", "");
  lines.push(fallback(conclusionParagraphs.mainAnswer, "não preenchido"), "");
  lines.push("## Paragraph 2, Broader Meaning", "");
  lines.push(fallback(conclusionParagraphs.broaderMeaning, "não preenchido"), "");

  lines.push("# Supporting Information", "");
  const siItems: [string, string][] = [
    ["Protocolos e reprodutibilidade", data.supportingInfo.protocolsAndReproducibility],
    ["Figuras, espectros e tabelas complementares", data.supportingInfo.additionalFiguresAndData],
    ["Controles e dados estatísticos adicionais", data.supportingInfo.controlsAndStatistics],
  ];
  siItems.forEach(([label, value]) => {
    if (value && value.trim().length > 0) {
      lines.push(`- **${label}:** ${value.trim()}`);
    } else {
      lines.push(`- **${label}:** _não preenchido_`);
    }
  });
  lines.push("");

  return lines.join("\n");
}
