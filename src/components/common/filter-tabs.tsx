"use client";

type FilterTab = {
  label: string;
  value: string;
};

type FilterTabsProps = {
  activeValue?: string;
  className?: string;
  onChange?: (value: string) => void;
  tabs: FilterTab[];
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function FilterTabs({ activeValue, className, onChange, tabs }: FilterTabsProps) {
  const resolvedActiveValue = activeValue ?? tabs[0]?.value;

  return (
    <div className={joinClassNames("flex flex-wrap gap-3", className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.value === resolvedActiveValue;
        return (
          <button
            aria-selected={isActive}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive ? "bg-hnb text-ink" : "bg-white/[0.13] text-white/76 hover:bg-white/[0.18] hover:text-white"
            }`}
            key={tab.value}
            onClick={() => onChange?.(tab.value)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
