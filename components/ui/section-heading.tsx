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
      <p className="text-xs font-medium uppercase tracking-[0.42em] text-amber-100/80">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
