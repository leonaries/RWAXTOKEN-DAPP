"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type DetailModalProps = {
  children: ReactNode;
  eyebrow?: string;
  isOpen: boolean;
  maxWidthClassName?: string;
  onClose: () => void;
  title: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function DetailModal({
  children,
  eyebrow = "详情确认",
  isOpen,
  maxWidthClassName = "max-w-3xl",
  onClose,
  title
}: DetailModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/72 px-4 py-8 backdrop-blur-sm">
      <button aria-label="关闭弹窗遮罩" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <section
        aria-modal="true"
        className={joinClassNames(
          "relative max-h-[86vh] w-full overflow-y-auto rounded-[28px] border border-white/14 bg-[#17191d] p-6 text-white shadow-2xl shadow-black/40 sm:p-8",
          maxWidthClassName
        )}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? <p className="text-sm font-bold text-hnb">{eyebrow}</p> : null}
            <h2 className="mt-2 text-2xl font-black tracking-normal">{title}</h2>
          </div>
          <button
            aria-label="关闭弹窗"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white/68 transition hover:bg-hnb hover:text-ink"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
