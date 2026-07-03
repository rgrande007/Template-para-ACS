import { describe, expect, it } from "vitest";
import { createDefaultFormData, createEmptyFigure } from "./formSchema";
import {
  buildAbstractParagraph,
  buildConclusionParagraphs,
  buildFigureParagraph,
  generateMarkdown,
} from "./generateMarkdown";

describe("buildAbstractParagraph", () => {
  it("joins only the non-empty parts with a space", () => {
    const result = buildAbstractParagraph({
      context: "Contexto.",
      gap: "",
      strategy: "Estratégia.",
      result: "",
      significance: "Significado.",
    });
    expect(result).toBe("Contexto. Estratégia. Significado.");
  });

  it("returns an empty string when every field is empty", () => {
    const result = buildAbstractParagraph({ context: "", gap: "", strategy: "", result: "", significance: "" });
    expect(result).toBe("");
  });
});

describe("buildFigureParagraph", () => {
  it("returns an empty string when the figure has no content", () => {
    const paragraph = buildFigureParagraph({ mainObservation: "", interpretation: "", bridge: "" }, 1);
    expect(paragraph).toBe("");
  });

  it("fills in placeholders for missing fields but keeps provided ones", () => {
    const paragraph = buildFigureParagraph({ mainObservation: "halos maiores", interpretation: "", bridge: "" }, 2);
    expect(paragraph).toContain("A Figura 2 mostra halos maiores.");
    expect(paragraph).toContain("[interpretação científica]");
    expect(paragraph).toContain("[ponte]");
  });
});

describe("buildConclusionParagraphs", () => {
  it("only builds a paragraph once its trigger field is filled", () => {
    const data = createDefaultFormData();
    const empty = buildConclusionParagraphs(data);
    expect(empty.mainAnswer).toBe("");
    expect(empty.broaderMeaning).toBe("");

    data.conclusions.mainAnswer = "as AgNPs inibem o crescimento bacteriano";
    data.conclusions.fieldChange = "abre uma rota mais sustentável";
    const filled = buildConclusionParagraphs(data);
    expect(filled.mainAnswer).toContain("as AgNPs inibem o crescimento bacteriano");
    expect(filled.broaderMeaning).toContain("abre uma rota mais sustentável");
  });
});

describe("generateMarkdown", () => {
  it("uses fallback placeholders for every unfilled section on an empty form", () => {
    const markdown = generateMarkdown(createDefaultFormData());
    expect(markdown).toContain("_Título provisório_");
    expect(markdown).toContain("_Abstract ainda não preenchido_");
    expect(markdown).toContain("_não preenchido_");
    expect(markdown).toContain("# Supporting Information");
  });

  it("renders one Figure heading per figure and reflects the student's answers", () => {
    const data = createDefaultFormData();
    data.title.finalTitle = "Título de teste";
    data.results.figures = [createEmptyFigure(1), createEmptyFigure(2)];
    data.results.figures[0].atomicSentence = "A Figura 1 mostra X.";
    data.results.figures[1].atomicSentence = "A Figura 2 mostra Y.";

    const markdown = generateMarkdown(data);
    expect(markdown).toContain("# Título de teste");
    expect(markdown).toContain("## Figure 1");
    expect(markdown).toContain("## Figure 2");
    expect(markdown).toContain("A Figura 1 mostra X.");
    expect(markdown).toContain("A Figura 2 mostra Y.");
  });

  it("marks unfilled Supporting Information items as not filled in", () => {
    const data = createDefaultFormData();
    data.supportingInfo.protocolsAndReproducibility = "Protocolo detalhado X";
    const markdown = generateMarkdown(data);
    expect(markdown).toContain("**Protocolos e reprodutibilidade:** Protocolo detalhado X");
    expect(markdown).toContain("**Controles e dados estatísticos adicionais:** _não preenchido_");
  });
});
