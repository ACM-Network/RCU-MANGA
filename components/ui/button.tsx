import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const styles = {
  base: "inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300",
  primary:
    "bg-gradient-to-r from-rose-600 via-red-500 to-violet-700 text-white shadow-[0_12px_28px_rgba(255,43,85,0.25)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(255,43,85,0.35)]",
  secondary:
    "bg-white/5 text-white hover:-translate-y-0.5 hover:bg-white/10",
  ghost: "bg-transparent text-zinc-200 hover:bg-white/5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof styles;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(styles.base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends LinkProps {
  variant?: keyof typeof styles;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(styles.base, styles[variant], className)} {...props}>
      {children}
    </Link>
  );
}
