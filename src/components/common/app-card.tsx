import type { ReactNode } from "react";

type AppCardProps = {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  header?: ReactNode;
  title?: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function AppCard({ children, className, footer, header, title }: AppCardProps) {
  return (
    <article className={joinClassNames("rounded-2xl bg-white/[0.13] p-5 text-white", className)}>
      {header || title ? (
        <header className="mb-5 flex items-start justify-between gap-4">
          {title ? <h2 className="text-lg font-black tracking-normal">{title}</h2> : header}
        </header>
      ) : null}
      {children}
      {footer ? <footer className="mt-5">{footer}</footer> : null}
    </article>
  );
}
