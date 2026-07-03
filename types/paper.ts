export interface InitialData {
  studentName: string;
  targetJournal: string;
}

export interface CentralSentenceData {
  system: string;
  strategy: string;
  mainFinding: string;
  centralSentence: string;
}

export interface TitleData {
  finalTitle: string;
}

export interface AbstractData {
  context: string;
  gap: string;
  strategy: string;
  result: string;
  significance: string;
}

export interface IntroductionData {
  paragraph1Context: string;
  paragraph2StateOfArt: string;
  paragraph3Gap: string;
  paragraph4Objective: string;
}

export interface MethodsData {
  materials: string;
  preparation: string;
  characterization: string;
  controls: string;
}

export interface FigureData {
  id: string;
  atomicSentence: string;
  mainObservation: string;
  interpretation: string;
  bridge: string;
}

export interface ResultsData {
  numberOfFigures: number;
  figures: FigureData[];
}

export interface ConclusionsData {
  mainAnswer: string;
  supportingData: string;
  fieldChange: string;
  limitation: string;
  nextStep: string;
}

export interface SupportingInfoData {
  protocolsAndReproducibility: string;
  additionalFiguresAndData: string;
  controlsAndStatistics: string;
}

export interface PaperFormData {
  initial: InitialData;
  centralSentence: CentralSentenceData;
  title: TitleData;
  abstract: AbstractData;
  introduction: IntroductionData;
  methods: MethodsData;
  results: ResultsData;
  conclusions: ConclusionsData;
  supportingInfo: SupportingInfoData;
}

export type NotionSaveStatus = "idle" | "saving" | "success" | "error";
