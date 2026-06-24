import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Blocks,
  CircleUserRound,
  Gem,
  Landmark,
  Pickaxe,
  ShieldCheck,
  Sparkles,
  Wallet
} from "lucide-react";

const navItems = [
  "RWA LIST",
  "Token打新",
  "Token金融",
  "Staking",
  "品牌Token",
  "HNB矿池",
  "活动广场",
  "社区星球"
];

const stats = [
  ["链上资产", "0,000.00", "USDT"],
  ["参与人次", "0,000.00", "Users"],
  ["板块总量", "0,000.00", "HNB"]
];

const featureCards = [
  {
    title: "RWA Token 打新专区",
    copy: "新资产上线、认购额度和倒计时集中展示。",
    icon: Sparkles
  },
  {
    title: "RWA Token 金融板块",
    copy: "围绕收益、流动性和项目进度组织金融产品。",
    icon: Landmark
  },
  {
    title: "Staking专区",
    copy: "质押周期、预计收益和参与状态一屏扫清。",
    icon: ShieldCheck
  },
  {
    title: "品牌Token专区",
    copy: "品牌微官网、Token资产和商品入口统一承载。",
    icon: Gem
  }
];

const productCards = ["实物商城", "众筹广场", "NFT商城"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f7f5] text-ink">
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 grid-fade opacity-70" />
        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full border border-hnb/25" />
        <div className="absolute bottom-0 left-1/2 h-px w-[76vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-hnb/50 to-transparent" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink">
              <Blocks className="h-6 w-6 text-cyanweb" />
            </span>
            <span className="text-lg font-black tracking-wide">RWAXTOKEN</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/68 lg:flex">
            {navItems.slice(0, 6).map((item) => (
              <a className="transition hover:text-hnb" href={`#${item}`} key={item}>
                {item}
              </a>
            ))}
          </nav>
          <Link
            href="/login"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-hnb px-5 text-sm font-bold text-ink transition hover:bg-white"
          >
            链接/登陆
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-88px)] max-w-7xl items-center gap-12 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex rounded-full border border-white/12 px-4 py-2 text-sm text-hnb">
              为实体电子商城提供 RWA 上链的最佳解决方案
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
              RWAXTOKEN
              <span className="mt-4 block text-white/60">DAPP</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/66">
              聚合打新、Token金融、Staking、品牌Token、HNB矿池与活动广场，让 RWA 项目从展示、参与到资产流转形成一个完整入口。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-bold text-ink transition hover:bg-hnb"
              >
                进入登录页
                <Wallet className="h-5 w-5" />
              </Link>
              <a
                href="#RWA LIST"
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-white/16 px-7 text-base font-semibold text-white/80 transition hover:border-hnb hover:text-hnb"
              >
                查看板块
              </a>
            </div>
          </div>

          <div className="relative min-h-[470px]">
            <div className="absolute left-5 top-10 h-72 w-72 rounded-full orbital-ring opacity-70" />
            <div className="absolute bottom-8 right-0 h-80 w-80 rounded-full border border-dashed border-hnb/40" />
            <div className="animate-float-slow absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/14 bg-white/[0.03] shadow-glow backdrop-blur">
              <div className="wire-cube left-10 top-8" />
              <div className="wire-cube right-12 top-20 scale-75" />
              <div className="wire-cube bottom-16 left-24 scale-90" />
              <div className="absolute bottom-7 left-1/2 h-24 w-28 -translate-x-1/2 rounded-2xl border border-white/20 bg-black shadow-2xl">
                <div className="absolute inset-x-5 top-4 h-2 rounded-full bg-white/70" />
                <div className="absolute bottom-5 left-6 flex gap-2">
                  <span className="h-6 w-6 rounded-full bg-cyanweb" />
                  <span className="h-6 w-6 rounded-full bg-hnb" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="RWA LIST" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(([label, value, unit]) => (
            <div className="rounded-lg border border-line bg-white p-7 shadow-soft" key={label}>
              <p className="text-sm font-semibold text-black/48">{label}</p>
              <div className="mt-4 flex items-end gap-2">
                <strong className="text-4xl font-black tracking-normal">{value}</strong>
                <span className="pb-1 text-sm font-bold text-black/38">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-4">
        {featureCards.map(({ title, copy, icon: Icon }) => (
          <article className="rounded-lg border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-hnb hover:shadow-soft" key={title}>
            <Icon className="h-7 w-7 text-ink" />
            <h2 className="mt-8 text-xl font-black">{title}</h2>
            <p className="mt-3 leading-7 text-black/58">{copy}</p>
          </article>
        ))}
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold text-black/40">热门商品</p>
            <h2 className="mt-3 text-4xl font-black">商城与品牌专区</h2>
            <p className="mt-5 leading-7 text-black/58">
              承接实物商城、众筹广场、NFT商城、品牌微官网与平台活动，保留原型中的模块入口和底部导航结构。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {productCards.map((item) => (
              <div className="rounded-lg bg-mist p-6" key={item}>
                <BadgeDollarSign className="h-7 w-7 text-hnb" />
                <h3 className="mt-16 text-xl font-black">{item}</h3>
                <p className="mt-2 text-sm text-black/48">商品价格 / HNB Token / USD</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-ink px-5 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <CircleUserRound className="h-6 w-6 text-hnb" />
            <span className="font-black">© Rwaxtoken.com</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/52">
            <span>平台首页</span>
            <span>系统公告</span>
            <span>品牌商城</span>
            <span>SWAP</span>
            <span>Official social media</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
