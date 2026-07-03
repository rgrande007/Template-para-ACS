"use client";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "email" | "select" | "combo";
  placeholder?: string;
  rows?: number;
  options?: string[];
  helpText?: string;
  required?: boolean;
}

export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  rows = 4,
  options,
  helpText,
  required = false,
}: FormFieldProps) {
  const datalistId = `datalist-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className="block mb-5">
      <span className="block text-sm font-semibold text-ink mb-1">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-label="obrigatório">
            *
          </span>
        )}
      </span>
      {helpText && <span className="block text-xs text-muted mb-2">{helpText}</span>}

      {type === "textarea" && (
        <textarea
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {type === "select" && options && (
        <select
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {(type === "text" || type === "email") && (
        <input
          type={type}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {type === "combo" && options && (
        <>
          <input
            type="text"
            list={datalistId}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <datalist id={datalistId}>
            {options.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </>
      )}
    </label>
  );
}
