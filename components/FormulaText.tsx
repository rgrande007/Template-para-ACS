function capitalize(text: string): string {
  return text.length > 0 ? text[0].toUpperCase() + text.slice(1) : text;
}

/**
 * Renderiza uma fórmula de escrita destacando cada [componente entre colchetes]
 * como um chip visual e cada "+" isolado como um conector, em vez de texto corrido.
 */
export default function FormulaText({ formula }: { formula: string }) {
  const parts = formula.split(/(\[[^\]]+\])/g).filter((part) => part !== "");

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span
              key={index}
              className="mx-0.5 inline-block rounded-full border border-accent/30 bg-white px-2.5 py-0.5 align-middle text-[13px] font-semibold not-italic leading-6 text-accent"
            >
              {capitalize(part.slice(1, -1))}
            </span>
          );
        }
        if (part.trim() === "+") {
          return (
            <span
              key={index}
              aria-hidden="true"
              className="mx-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 align-middle text-[10px] font-bold not-italic text-amber-800"
            >
              +
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
