"use client";

import { SupportingInfoData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import { STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: SupportingInfoData;
  onChange: (data: SupportingInfoData) => void;
}

export default function StepSupportingInfo({ data, onChange }: StepProps) {
  const meta = STEP_META[8];
  const set = (field: keyof SupportingInfoData) => (value: string) => onChange({ ...data, [field]: value });

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormField
        label="Protocolos e reprodutibilidade"
        helpText="Protocolos detalhados que outro pesquisador precisaria para repetir o experimento."
        type="textarea"
        value={data.protocolsAndReproducibility}
        onChange={set("protocolsAndReproducibility")}
      />
      <FormField
        label="Figuras, espectros e tabelas complementares"
        helpText="Material extra que não precisa aparecer no corpo do paper, mas sustenta os resultados."
        type="textarea"
        value={data.additionalFiguresAndData}
        onChange={set("additionalFiguresAndData")}
      />
      <FormField
        label="Controles e dados estatísticos adicionais"
        helpText="Só preencha se o seu estudo tiver controles extras ou tratamento estatístico a detalhar."
        type="textarea"
        value={data.controlsAndStatistics}
        onChange={set("controlsAndStatistics")}
      />
    </StepCard>
  );
}
