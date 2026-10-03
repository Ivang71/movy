import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/format";

type Variant = "primary" | "glass" | "ghost";
type Size = "md" | "sm" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const base =
  "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neo-bg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "rounded-full text-[#05070a] bg-text-hi hover:bg-white",
  glass: "control-3d rounded-full text-text-hi hover:border-white/15",
  ghost: "rounded-[8px] text-white/75 hover:text-white hover:bg-white/[0.07]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 gap-2 md:h-11 md:gap-3 md:px-6 text-[13px] md:text-sm",
  sm: "h-9 px-3.5 gap-2 text-[12.5px]",
  icon: "h-8 w-8",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "glass", size = "md", icon, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
    </button>
  );
});
