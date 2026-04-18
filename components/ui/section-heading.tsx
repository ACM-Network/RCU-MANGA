import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      <p className="text-xs font-medium uppercase tracking-[0.42em] text-rose-400">{eyebrow}</p>
      <h2 className="section-title text-3xl text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
