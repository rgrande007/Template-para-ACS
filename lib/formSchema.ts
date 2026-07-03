import { FigureData, PaperFormData } from "@/types/paper";

export const STEP_META: { id: string; title: string; objective: string }[] = [
  {
    id: "initial",
    title: "Dados iniciais",
    objective: "Identificar o aluno, o tema do trabalho e a revista alvo.",
  },
  {
    id: "central-sentence",
    title: "Hipótese central",
    objective:
      "Definir a hipótese ou contribuição científica que você pretende demonstrar — pode ser reescrita conforme os resultados aparecerem.",
  },
  {
    id: "title",
    title: "Title",
    objective: "Rascunhar um título claro, específico e informativo — ele muda conforme o projeto avança.",
  },
  {
    id: "abstract",
    title: "Abstract",
    objective:
      "Resumir o projeto em poucas frases. No início, use o resultado que você espera encontrar; ajuste depois com os dados reais.",
  },
  {
    id: "introduction",
    title: "Introduction",
    objective: "Levar o leitor do campo amplo até a pergunta que este projeto pretende responder.",
  },
  {
    id: "methods",
    title: "Experimental Section / Methods",
    objective:
      "Planejar (e depois registrar) como o estudo é feito, para que outro pesquisador consiga reproduzir os resultados principais.",
  },
  {
    id: "results",
    title: "Results and Discussion",
    objective:
      "Organizar, por figura, o que você espera encontrar (ou já encontrou) em sequência lógica e explicar o que isso significa.",
  },
  {
    id: "conclusions",
    title: "Conclusions",
    objective:
      "Esboçar a resposta esperada à pergunta do projeto e seu significado mais amplo — revise quando os dados finais estiverem prontos.",
  },
  {
    id: "supporting-info",
    title: "Supporting Information",
    objective:
      "Listar dados complementares que sustentam o paper, mas não precisam interromper a narrativa principal.",
  },
];

export const ACS_JOURNALS = [
  "Journal of the American Chemical Society (JACS)",
  "ACS Nano",
  "ACS Catalysis",
  "ACS Applied Materials & Interfaces",
  "Inorganic Chemistry",
  "The Journal of Physical Chemistry C",
  "Analytical Chemistry",
  "ACS Omega",
];

export function createEmptyFigure(index: number): FigureData {
  return {
    id: `figure-${index}-${Date.now()}`,
    atomicSentence: "",
    mainObservation: "",
    interpretation: "",
    bridge: "",
  };
}

export function createDefaultFormData(): PaperFormData {
  return {
    initial: {
      studentName: "",
      targetJournal: "",
    },
    centralSentence: {
      system: "",
      strategy: "",
      mainFinding: "",
      centralSentence: "",
    },
    title: {
      finalTitle: "",
    },
    abstract: {
      context: "",
      gap: "",
      strategy: "",
      result: "",
      significance: "",
    },
    introduction: {
      paragraph1Context: "",
      paragraph2StateOfArt: "",
      paragraph3Gap: "",
      paragraph4Objective: "",
    },
    methods: {
      materials: "",
      preparation: "",
      characterization: "",
      controls: "",
    },
    results: {
      numberOfFigures: 1,
      figures: [1].map((n) => createEmptyFigure(n)),
    },
    conclusions: {
      mainAnswer: "",
      supportingData: "",
      fieldChange: "",
      limitation: "",
      nextStep: "",
    },
    supportingInfo: {
      protocolsAndReproducibility: "",
      additionalFiguresAndData: "",
      controlsAndStatistics: "",
    },
  };
}

export const STORAGE_KEY = "acs-paper-builder-form-data";
