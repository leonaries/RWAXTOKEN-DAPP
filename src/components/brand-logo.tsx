import { Blocks } from "lucide-react";

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  markClassName?: string;
  textClassName?: string;
};

export function BrandLogo({
  className = "flex items-center gap-3",
  iconClassName = "h-6 w-6 text-cyanweb",
  markClassName = "grid h-10 w-10 place-items-center rounded-xl bg-white text-ink",
  textClassName = "text-lg font-black tracking-wide"
}: BrandLogoProps) {
  return (
    <span className={className}>
      <span className={markClassName}>
        <Blocks className={iconClassName} />
      </span>
      <span className={textClassName}>RWAXTOKEN</span>
    </span>
  );
}
