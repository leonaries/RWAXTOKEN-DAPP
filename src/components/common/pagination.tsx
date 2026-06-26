"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  className?: string;
  currentPage: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  total: number;
};

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Pagination({ className, currentPage, onPageChange, pageSize = 10, total }: PaginationProps) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const page = clampPage(currentPage, totalPages);

  return (
    <nav
      aria-label="分页"
      className={joinClassNames("flex items-center justify-between gap-3 text-sm text-white/60", className)}
    >
      <span>
        共 {total} 条 / 第 {page} 页
      </span>
      <div className="flex items-center gap-2">
        <button
          aria-label="上一页"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.13] text-white transition hover:bg-hnb hover:text-ink disabled:pointer-events-none disabled:opacity-35"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-14 text-center font-semibold text-white">
          {page}/{totalPages}
        </span>
        <button
          aria-label="下一页"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.13] text-white transition hover:bg-hnb hover:text-ink disabled:pointer-events-none disabled:opacity-35"
          disabled={page >= totalPages}
          onClick={() => onPageChange?.(page + 1)}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
