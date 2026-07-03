interface SectionIconProps {
  id: string;
  className?: string;
}

const shared = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function SectionIcon({ id, className }: SectionIconProps) {
  const props = { ...shared, viewBox: "0 0 20 20", className, width: 18, height: 18 };

  switch (id) {
    case "initial":
      return (
        <svg {...props}>
          <circle cx="10" cy="6.5" r="3" />
          <path d="M3.5 17c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" />
        </svg>
      );
    case "central-sentence":
      return (
        <svg {...props}>
          <path d="M5 6.5h10M5 10h6.5" />
          <path d="M4 14.5 6 17l2-2.5H16A1.5 1.5 0 0 0 17.5 13V5.5A1.5 1.5 0 0 0 16 4H4A1.5 1.5 0 0 0 2.5 5.5V13A1.5 1.5 0 0 0 4 14.5Z" />
        </svg>
      );
    case "title":
      return (
        <svg {...props}>
          <path d="M4 5h12M6 5v10M14 5v10M6 10h8" />
        </svg>
      );
    case "abstract":
      return (
        <svg {...props}>
          <path d="M5 2.5h7l3 3v12H5Z" />
          <path d="M7 9h6M7 12h6M7 15h3.5" />
        </svg>
      );
    case "introduction":
      return (
        <svg {...props}>
          <path d="M4 3.5v13M4 3.5h9l-2 3 2 3H4" />
        </svg>
      );
    case "methods":
      return (
        <svg {...props}>
          <path d="M8 2.5h4M8.5 2.5v4.8L4.8 15a1.5 1.5 0 0 0 1.3 2.2h7.8a1.5 1.5 0 0 0 1.3-2.2L11.5 7.3V2.5" />
          <path d="M6.5 12h7" />
        </svg>
      );
    case "results":
      return (
        <svg {...props}>
          <path d="M3.5 16.5v-6M9 16.5v-9M14.5 16.5v-3.5" />
          <path d="M2.5 16.5h15" />
        </svg>
      );
    case "conclusions":
      return (
        <svg {...props}>
          <circle cx="10" cy="10" r="7" />
          <path d="M7 10.2 9 12l4-4.5" />
        </svg>
      );
    case "supporting-info":
      return (
        <svg {...props}>
          <path d="M12.5 5 7.8 9.7a2.5 2.5 0 0 0 3.5 3.5l5-5a4 4 0 1 0-5.6-5.6l-5.2 5.2" />
        </svg>
      );
    case "review":
      return (
        <svg {...props}>
          <path d="M10 14V4M10 4 6.5 7.5M10 4l3.5 3.5" />
          <path d="M3.5 14v1.5A1.5 1.5 0 0 0 5 17h10a1.5 1.5 0 0 0 1.5-1.5V14" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
  }
}
