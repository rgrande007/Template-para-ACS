interface ResizeHandleProps {
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  valueNow: number;
  valueMin: number;
  valueMax: number;
}

export default function ResizeHandle({ onPointerDown, onKeyDown, valueNow, valueMin, valueMax }: ResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Redimensionar painel de prévia"
      aria-valuenow={Math.round(valueNow)}
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className="sticky top-24 hidden h-[calc(100vh-7rem)] w-2 shrink-0 cursor-col-resize items-center justify-center rounded-full transition hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-accent lg:flex"
    >
      <div className="h-16 w-1 rounded-full bg-stone-300" />
    </div>
  );
}
