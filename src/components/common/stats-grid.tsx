type StatItem = {
  label: string;
  unit?: string;
  value: string;
};

type StatsGridProps = {
  className?: string;
  columnsClassName?: string;
  items: StatItem[];
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function StatsGrid({ className, columnsClassName = "md:grid-cols-2 xl:grid-cols-4", items }: StatsGridProps) {
  return (
    <div className={joinClassNames("grid gap-5", columnsClassName, className)}>
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export function StatCard({ label, unit, value }: StatItem) {
  return (
    <div className="rounded-2xl bg-white/[0.13] p-5 text-white">
      <strong className="block text-lg font-black tracking-normal">{value}</strong>
      <span className="mt-1 block text-xs font-semibold text-white/44">
        {label}
        {unit ? ` / ${unit}` : ""}
      </span>
    </div>
  );
}
