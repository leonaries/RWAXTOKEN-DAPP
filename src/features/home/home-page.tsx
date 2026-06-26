import { AppButton } from "@/components/app-button";
import {
  activityCards,
  brandCards,
  communityCards,
  financeCards,
  miningCards,
  productCards,
  qaCards,
  sectorCards,
  stats
} from "@/features/home/home.constants";
import { ArrowRight, ImageIcon, Megaphone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function HomePage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-ink">
        <div className="absolute inset-0 grid-fade opacity-70" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8">
          <h1 className="mb-8 text-2xl font-black tracking-normal">平台首页</h1>

          <div className="rounded-2xl border border-white/14 bg-white/[0.055] p-4 shadow-[0_22px_70px_rgb(0_0_0/0.22)] sm:p-5 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:gap-5">
            <div className="flex min-h-[210px] flex-col justify-between py-3 lg:py-5">
              <div>
                <h2 className="max-w-xl text-2xl font-black leading-snug tracking-normal lg:text-[30px]">
                  广告语，最多2行，超出的省略...广告语，最多2行，超出的省略...
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-6 text-white/52">
                  广告语，最多2行，超出的省略...广告语，最多2行，超出的省略...
                </p>
              </div>
              <AppButton className="mt-6 w-fit" href="/activities" size="lg">
                跳转链接
              </AppButton>
              <div className="mt-6 hidden grid-cols-6 gap-1.5 lg:grid">
                {Array.from({ length: 6 }, (_, index) => (
                  <span className="h-1.5 rounded-full bg-white/24" key={index} />
                ))}
              </div>
            </div>

            <div className="mt-4 grid min-h-[210px] place-items-center rounded-xl bg-white/30 lg:mt-0">
              <ImageIcon className="h-7 w-7 text-white/40" />
            </div>
          </div>

          <div className="mt-8 grid gap-0 overflow-hidden rounded-2xl bg-white/[0.13] md:grid-cols-3 xl:grid-cols-6">
            {stats.map(([label, value, unit]) => (
              <div className="border-white/10 p-5 md:border-r last:border-r-0" key={label}>
                <p className="text-xs font-semibold text-white/45">{label}</p>
                <strong className="mt-4 block text-xl font-black tracking-normal text-white">{value}</strong>
                <span className="mt-1 block text-xs font-semibold text-white/42">{unit}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex h-11 items-center rounded-2xl bg-white/[0.13] px-4 text-white/72">
            <Megaphone className="mr-3 h-5 w-5 text-white" />
            <span className="truncate text-sm">平台公告：为实体电子商城提供 RWA 上链的最佳解决方案 ...</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-5 py-10 sm:px-8">
        <HomeSection title="热门活动" moreHref="/activities">
          <div className="grid gap-5 lg:grid-cols-2">
            {activityCards.map((activity, index) => (
              <article className="rounded-2xl bg-white/[0.13] p-5" key={index}>
                <h3 className="text-lg font-black">{activity.title}</h3>
                <p className="mt-5 text-sm text-white/44">{activity.copy}</p>
                <div className="mt-8 grid w-full max-w-[280px] grid-cols-2 rounded-lg bg-black/16 p-3">
                  <Metric label="奖金" value={activity.prize} />
                  <Metric label="人气" value={activity.popularity} />
                </div>
              </article>
            ))}
          </div>
        </HomeSection>

        <HomeSection title="热门商品" moreHref="/market">
          <div className="grid gap-5 md:grid-cols-3">
            {productCards.map(({ title, icon: Icon }) => (
              <article className="min-h-[190px] rounded-2xl bg-white/[0.13] p-5" key={title}>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-hnb">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-12 grid grid-cols-2 gap-4">
                  <Metric label="商品价格" value="0.00" />
                  <Metric label="HNB Token / USD" value="0.0000" />
                </div>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
              </article>
            ))}
          </div>
        </HomeSection>

        <HomeSection title="Token 金融" moreHref="/rwa-list/finance">
          <div className="grid gap-5 lg:grid-cols-3">
            {financeCards.map(({ title, copy, icon: Icon }) => (
              <article className="rounded-2xl bg-white/[0.13] p-5" key={title}>
                <Icon className="h-7 w-7 text-hnb" />
                <h3 className="mt-12 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/48">{copy}</p>
              </article>
            ))}
          </div>
        </HomeSection>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <HomeSection title="HNB矿池" moreHref="/hnb-pool">
            <div className="rounded-2xl bg-white/[0.13] p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {miningCards.map((item) => (
                  <Metric key={item.label} label={item.label} unit={item.unit} value={item.value} />
                ))}
              </div>
              <div className="mt-8 h-24 rounded-xl border border-dashed border-white/18 bg-black/10" />
            </div>
          </HomeSection>

          <HomeSection title="社区星球" moreHref="/community">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              {communityCards.map(({ title, copy, icon: Icon }) => (
                <article className="rounded-2xl bg-white/[0.13] p-5" key={title}>
                  <Icon className="h-7 w-7 text-hnb" />
                  <h3 className="mt-8 text-lg font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/48">{copy}</p>
                </article>
              ))}
            </div>
          </HomeSection>
        </div>

        <HomeSection title="品牌专区" moreHref="/rwa-list/brand-token">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
            {brandCards.map((brand) => (
              <article className="rounded-2xl bg-white/[0.13] p-4 text-center" key={brand.id}>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
                  <ImageIcon className="h-6 w-6 text-white/44" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white/72">{brand.title}</p>
              </article>
            ))}
          </div>
        </HomeSection>

        <HomeSection title="RWA LIST" moreHref="/rwa-list">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {sectorCards.map(({ title, copy, icon: Icon }) => (
              <article className="rounded-2xl bg-white/[0.13] p-5" key={title}>
                <Icon className="h-7 w-7 text-hnb" />
                <h3 className="mt-8 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/48">{copy}</p>
                <div className="mt-8 grid grid-cols-2 gap-3 rounded-lg bg-black/14 p-3">
                  <Metric label="参与人次" value="0,000.00" />
                  <Metric label="板块总量" value="0,000.00" />
                </div>
              </article>
            ))}
          </div>
        </HomeSection>

        <div className="grid gap-6 lg:grid-cols-2">
          {qaCards.map(({ title, copy, icon: Icon }) => (
            <HomeSection key={title} title={title} moreHref={title === "Q&A" ? "/qa" : "/services"}>
              <article className="min-h-[150px] rounded-2xl bg-white/[0.13] p-5">
                <Icon className="h-7 w-7 text-hnb" />
                <p className="mt-8 text-sm leading-6 text-white/52">{copy}</p>
              </article>
            </HomeSection>
          ))}
        </div>
      </section>
    </main>
  );
}

type HomeSectionProps = {
  children: ReactNode;
  moreHref: string;
  title: string;
};

function HomeSection({ children, moreHref, title }: HomeSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black tracking-normal">{title}</h2>
        <AppButton href={moreHref} rightIcon={<ArrowRight className="h-3.5 w-3.5" />} size="sm">
          更多
        </AppButton>
      </div>
      {children}
    </section>
  );
}

type MetricProps = {
  label: string;
  unit?: string;
  value: string;
};

function Metric({ label, unit, value }: MetricProps) {
  return (
    <div>
      <strong className="block text-lg font-black tracking-normal text-white">{value}</strong>
      <span className="mt-1 block text-xs font-medium text-white/44">
        {label}
        {unit ? ` / ${unit}` : ""}
      </span>
    </div>
  );
}
