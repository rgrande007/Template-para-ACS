"use client";

import { ReactNode } from "react";

interface StepCardProps {
  id?: string;
  title: string;
  objective: string;
  children: ReactNode;
}

export default function StepCard({ id, title, objective, children }: StepCardProps) {
  return (
    <div id={id} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{objective}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
