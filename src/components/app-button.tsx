import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonSize = "sm" | "md" | "lg" | "xl";

type AppButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  rightIcon?: ReactNode;
  size?: AppButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClassNames: Record<AppButtonSize, string> = {
  sm: "h-8 min-w-[86px] px-4 text-xs",
  md: "h-10 min-w-[142px] px-5 text-sm",
  lg: "h-11 min-w-[180px] px-8 text-sm",
  xl: "h-[66px] px-8 text-2xl"
};

const baseClassName =
  "inline-flex items-center justify-center rounded-full bg-white/[0.13] font-semibold text-white transition hover:bg-hnb hover:text-ink disabled:pointer-events-none disabled:opacity-55";

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function AppButton({
  children,
  className,
  href,
  rightIcon,
  size = "md",
  type = "button",
  ...buttonProps
}: AppButtonProps) {
  const content = (
    <>
      <span>{children}</span>
      {rightIcon ? <span className="ml-2 inline-flex shrink-0">{rightIcon}</span> : null}
    </>
  );
  const resolvedClassName = joinClassNames(baseClassName, sizeClassNames[size], className);

  if (href) {
    return (
      <Link className={resolvedClassName} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={resolvedClassName} type={type} {...buttonProps}>
      {content}
    </button>
  );
}
