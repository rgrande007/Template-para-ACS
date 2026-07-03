"use client";

import { InitialData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import { ACS_JOURNALS, STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: InitialData;
  onChange: (data: InitialData) => void;
}

export default function StepInitial({ data, onChange }: StepProps) {
  const meta = STEP_META[0];
  const set = (field: keyof InitialData) => (value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormField
        label="Nome do aluno"
        required
        value={data.studentName}
        onChange={set("studentName")}
        placeholder="Seu nome completo"
      />
      <FormField
        label="Revista ACS alvo"
        type="combo"
        options={ACS_JOURNALS}
        placeholder="Digite ou escolha uma sugestão"
        value={data.targetJournal}
        onChange={set("targetJournal")}
      />
    </StepCard>
  );
}
