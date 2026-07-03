"use client";

interface MarkdownPreviewProps {
  markdown: string;
}

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return (
    <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-stone-300 bg-stone-50 p-4">
      <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink">
        {markdown}
      </pre>
    </div>
  );
}
