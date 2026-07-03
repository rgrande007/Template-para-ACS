import { describe, expect, it } from "vitest";
import { createDefaultFormData } from "./formSchema";
import { computeCompletion, computeSectionCompletion } from "./progress";

describe("computeSectionCompletion", () => {
  it("reports 0 for every section on an empty form", () => {
    const sections = computeSectionCompletion(createDefaultFormData());
    expect(Object.values(sections).every((r) => r === 0)).toBe(true);
  });

  it("reports 1 only for the section that got fully filled", () => {
    const data = createDefaultFormData();
    data.initial.studentName = "Maria";
    data.initial.targetJournal = "ACS Omega";

    const sections = computeSectionCompletion(data);
    expect(sections.initial).toBe(1);
    expect(sections.title).toBe(0);
  });

  it("weighs Results by how many figures the student added, not a fixed field count", () => {
    const data = createDefaultFormData();
    data.results.figures[0].atomicSentence = "Frase A";
    const partial = computeSectionCompletion(data).results;
    expect(partial).toBeGreaterThan(0);
    expect(partial).toBeLessThan(1);
  });
});

describe("computeCompletion", () => {
  it("returns 0 for a brand-new form", () => {
    expect(computeCompletion(createDefaultFormData())).toBe(0);
  });

  it("does not let Results dominate the overall percentage when many figures are added", () => {
    const withOneFigure = createDefaultFormData();
    withOneFigure.initial.studentName = "Maria";

    const withSixEmptyFigures = createDefaultFormData();
    withSixEmptyFigures.initial.studentName = "Maria";
    withSixEmptyFigures.results.numberOfFigures = 6;
    withSixEmptyFigures.results.figures = Array.from({ length: 6 }, (_, i) => ({
      ...withSixEmptyFigures.results.figures[0],
      id: `figure-${i}`,
    }));

    // Adding more empty figures must not change the overall percentage, since Results
    // is averaged as one section among many, not per individual field.
    expect(computeCompletion(withOneFigure)).toBe(computeCompletion(withSixEmptyFigures));
  });

  it("returns 100 when every section is completely filled", () => {
    const data = createDefaultFormData();
    for (const section of Object.values(data)) {
      if (Array.isArray((section as { figures?: unknown }).figures)) continue;
      for (const key of Object.keys(section as Record<string, string>)) {
        (section as Record<string, string>)[key] = "preenchido";
      }
    }
    data.results.figures = data.results.figures.map((figure) => ({
      ...figure,
      atomicSentence: "x",
      mainObservation: "x",
      interpretation: "x",
      bridge: "x",
    }));
    expect(computeCompletion(data)).toBe(100);
  });
});
