"use client";

import { MethodsData } from "@/types/paper";
import StepCard from "@/components/StepCard";
import FormField from "@/components/FormField";
import FormulaBox from "@/components/FormulaBox";
import { STEP_META } from "@/lib/formSchema";

interface StepProps {
  data: MethodsData;
  onChange: (data: MethodsData) => void;
}

export default function StepMethods({ data, onChange }: StepProps) {
  const meta = STEP_META[5];
  const set = (field: keyof MethodsData) => (value: string) => onChange({ ...data, [field]: value });

  return (
    <StepCard id={meta.id} title={meta.title} objective={meta.objective}>
      <FormulaBox
        formula="Materiais + preparo + caracterização (com a análise dos dados) + controles"
        example="Materiais: nitrato de prata, extrato de folhas de chá verde, tecido de algodão. Preparo: redução do nitrato de prata pelo extrato a 80°C por 30 min, seguida de impregnação do tecido por imersão. Caracterização: UV-Vis, DRX e MEV; halo de inibição e contagem de UFC em triplicata, com ANOVA e pós-teste de Tukey. Controles: tecido não tratado e tecido tratado apenas com extrato."
        example2="Materiais: cloreto de paládio, TiO2 mesoporoso comercial, agente redutor. Preparo: impregnação úmida do suporte com solução precursora de Pd, seguida de calcinação a 400°C. Caracterização: DRX, MEV-EDS e quimissorção de CO; conversão de CO medida por cromatografia gasosa em função da temperatura, testes de estabilidade em triplicata. Controles: TiO2 puro sem Pd e catalisador comercial de Pt/Al2O3."
        exampleLabel="Nanomateriais (têxtil)"
        example2Label="Catálise (CO)"
      />

      <FormField
        label="Materiais"
        helpText="Quais materiais, reagentes, amostras ou sistemas serão (ou foram) usados?"
        type="textarea"
        value={data.materials}
        onChange={set("materials")}
      />
      <FormField
        label="Preparo"
        helpText="Como as amostras serão (ou foram) preparadas?"
        type="textarea"
        value={data.preparation}
        onChange={set("preparation")}
      />
      <FormField
        label="Caracterização"
        helpText="Quais técnicas serão (ou foram) usadas para caracterizar, e como os dados serão (ou foram) analisados? Só detalhe a análise estatística se ela fizer parte do seu estudo."
        type="textarea"
        value={data.characterization}
        onChange={set("characterization")}
      />
      <FormField
        label="Controles"
        helpText="Quais controles ou comparações você vai (ou já) usar?"
        type="textarea"
        value={data.controls}
        onChange={set("controls")}
      />
    </StepCard>
  );
}
