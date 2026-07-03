import { PaperFormData } from "@/types/paper";

function ratio(values: string[]): number {
  if (values.length === 0) return 0;
  const filled = values.filter((v) => v.trim().length > 0).length;
  return filled / values.length;
}

export type SectionCompletion = Record<string, number>;

/** Fração (0 a 1) de campos preenchidos por seção, indexada pelo id usado em STEP_META. */
export function computeSectionCompletion(data: PaperFormData): SectionCompletion {
  const { initial, centralSentence, title, abstract, introduction, methods, results, conclusions, supportingInfo } =
    data;

  return {
    initial: ratio(Object.values(initial)),
    "central-sentence": ratio(Object.values(centralSentence)),
    title: ratio(Object.values(title)),
    abstract: ratio(Object.values(abstract)),
    introduction: ratio(Object.values(introduction)),
    methods: ratio(Object.values(methods)),
    results: ratio(
      results.figures.flatMap((figure) => [
        figure.atomicSentence,
        figure.mainObservation,
        figure.interpretation,
        figure.bridge,
      ])
    ),
    conclusions: ratio(Object.values(conclusions)),
    "supporting-info": ratio(Object.values(supportingInfo)),
  };
}

export function computeCompletion(data: PaperFormData): number {
  // Cada seção contribui igualmente para o percentual, independente de quantos
  // campos ela tem (evita que Results domine o total quando há várias figuras).
  const sectionRatios = Object.values(computeSectionCompletion(data));
  const average = sectionRatios.reduce((sum, r) => sum + r, 0) / sectionRatios.length;
  return Math.round(average * 100);
}
