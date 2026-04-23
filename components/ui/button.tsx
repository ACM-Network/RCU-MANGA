import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const styles = {
  base: "inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300 active:scale-[0.98]",
  primary:
    "bg-[linear-gradient(135deg,#ff8a54_0%,#ffca67_42%,#70d6d1_100%)] text-[#090a0f] shadow-[0_16px_36px_rgba(255,138,84,0.26)] hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(255,138,84,0.34)]",
  secondary:
    "bg-white/6 text-white hover:-translate-y-0.5 hover:bg-white/10",
  ghost: "bg-transparent text-stone-200 hover:bg-white/5",
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
