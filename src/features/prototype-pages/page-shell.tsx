"use client";

import { AppButton } from "@/components/app-button";
import { DetailModal } from "@/components/common";
import {
  BadgeDollarSign,
  Gem,
  ImageIcon,
  Package,
  Pickaxe,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  type LucideIcon
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

type PageShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
};

type Metric = {
  label: string;
  unit?: string;
  value: string;
};

type ProjectCard = {
  apy?: string;
  copy: string;
  icon: LucideIcon;
  progress?: string;
  stats: Metric[];
  title: string;
};

type PoolCardItem = {
  copy: string;
  duration: string;
  id: string;
  output: string;
  power: string;
  title: string;
  token: string;
  total: string;
};

const productCards = Array.from({ length: 10 }, (_, index) => ({
  title: "产品名称最多1行，超出省略...",
  copy: "产品概要说明最多2行，超出省略...",
  price: "0.00",
  token: "0.0000",
  id: `product-${index + 1}`
}));

const launchpadCards: ProjectCard[] = [
  {
    title: "RWA Token 打新 001 期",
    copy: "这里是一段小说明文字，查看详情（向下展开说明）概要",
    icon: Rocket,
    progress: "73%",
    stats: [
      { label: "本期总量", value: "0,000.00" },
      { label: "释放周期", value: "000", unit: "Day" },
      { label: "本期价格", value: "0,000.00" },
      { label: "本期截止", value: "0,000.00" }
    ]
  },
  {
    title: "RWA Token 打新 001 期",
    copy: "这里是一段小说明文字，查看详情（向下展开说明）概要",
    icon: Rocket,
    progress: "73%",
    stats: [
      { label: "本期总量", value: "0,000.00" },
      { label: "释放周期", value: "000", unit: "Day" },
      { label: "本期价格", value: "0,000.00" },
      { label: "本期截止", value: "0,000.00" }
    ]
  }
];

const financeCards: ProjectCard[] = [
  {
    title: "HNB 180天 Token权益认筹",
    copy: "这里是一段小说明文字，查看详情（向下展开说明）概要",
    icon: BadgeDollarSign,
    apy: "00.00%",
    progress: "73%",
    stats: [
      { label: "本期总额", value: "0,000.00" },
      { label: "当前APY", value: "00.00%" }
    ]
  },
  {
    title: "HNB 360天 Token权益认筹",
    copy: "这里是一段小说明文字，查看详情（向下展开说明）概要",
    icon: BadgeDollarSign,
    apy: "00.00%",
    progress: "73%",
    stats: [
      { label: "本期总额", value: "0,000.00" },
      { label: "当前APY", value: "00.00%" }
    ]
  }
];

const stakingCards: ProjectCard[] = ["HNB Staking 专区", "Token 01 Staking", "Token 02 Staking", "Token 03 Staking"].map(
  (title) => ({
    title,
    copy: "这里是一段小说明文字，查看详情（向下展开说明）概要",
    icon: ShieldCheck,
    apy: "00.00%",
    progress: "73%",
    stats: [
      { label: "本期总额", value: "0,000.00" },
      { label: "当前APY", value: "00.00%" }
    ]
  })
);

const brandTokenCards = Array.from({ length: 6 }, (_, index) => ({
  id: `brand-token-${index + 1}`,
  name: "品牌Token名称",
  supply: "0,000.00",
  price: "0,000.00"
}));

const poolCards: PoolCardItem[] = Array.from({ length: 2 }, (_, index) => ({
  id: `pool-${index + 1}`,
  title: "产品名称+矿池（一种设备一绑定挖矿）",
  copy: "这里是一段小说明文字，查看详情概要",
  token: "HNB",
  output: "0,000.00",
  power: "0,000.00",
  duration: "000",
  total: "0,000.00"
}));

export function PageShell({ children, eyebrow, title }: PageShellProps) {
  return (
    <main className="min-h-screen bg-ink px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        {eyebrow ? <p className="mb-3 text-sm font-bold text-hnb">{eyebrow}</p> : null}
        <h1 className="text-3xl font-black tracking-normal">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function MarketPage({ category = "全部商品" }: { category?: string }) {
  return (
    <PageShell eyebrow="在线商城" title={category}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <HeroPanel title="广告语，最多2行，超出的省略...最多2行，超出的省略..." buttonText="跳转商品详情页" />
        <section className="rounded-2xl bg-white/[0.11] p-5">
          <h2 className="text-lg font-black">热门品牌</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }, (_, index) => (
              <LogoTile key={index} label="品牌LOGO" />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {["全部默认分类", "价格排序", "销量排序", "分类排序", "奖励排序", "属性排序"].map((item) => (
          <span className="rounded-full bg-white/[0.13] px-4 py-2 text-sm font-semibold text-white/76" key={item}>
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {productCards.map((item) => (
          <article className="rounded-2xl bg-white/[0.13] p-5" key={item.id}>
            <div className="grid h-40 place-items-center rounded-xl bg-white/20">
              <ImageIcon className="h-8 w-8 text-white/45" />
            </div>
            <h3 className="mt-5 text-lg font-black">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/48">{item.copy}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-black/14 p-3">
              <Metric label="商品价格" value={item.price} />
              <Metric label="HNB Token / USD" value={item.token} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <AppButton size="sm" rightIcon={<ShoppingCart className="h-4 w-4" />}>
                加入购物车
              </AppButton>
              <AppButton size="sm">购买</AppButton>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl bg-white/[0.13] p-5">
          <h2 className="text-lg font-black">我的商城</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {["我的订单", "购物车", "优惠券"].map((item) => (
              <div className="rounded-xl bg-black/14 p-4 text-sm font-semibold" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.13] p-5">
          <h2 className="text-lg font-black">我的RWA</h2>
          <p className="mt-4 rounded-xl bg-black/14 p-4 text-sm text-white/58">成交信息滚动字段简要...</p>
          <p className="mt-3 rounded-xl bg-black/14 p-4 text-sm text-white/58">成交信息滚动字段简要...</p>
        </div>
      </section>
    </PageShell>
  );
}

export function RwaListPage() {
  return (
    <PageShell eyebrow="RWA LIST" title="RWA LIST">
      <HeroPanel title="为实体电子商城提供RWA上链的最佳解决方案 ..." buttonText="HNB BUY" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["当前价格", "0,000.00"],
          ["铸造总量", "0,000.00"],
          ["流通总量", "0,000.00"],
          ["奖励总量", "0,000.00"]
        ].map(([label, value]) => (
          <div className="rounded-2xl bg-white/[0.13] p-5" key={label}>
            <Metric label={label} unit="单位" value={value} />
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["RWA Token 打新专区", Rocket],
          ["RWA Token 金融板块", BadgeDollarSign],
          ["Staking专区", ShieldCheck],
          ["品牌Token专区", Gem]
        ].map(([title, Icon]) => (
          <article className="rounded-2xl bg-white/[0.13] p-5" key={String(title)}>
            {typeof Icon !== "string" ? <Icon className="h-7 w-7 text-hnb" /> : null}
            <h2 className="mt-8 text-lg font-black">{title as string}</h2>
            <p className="mt-3 text-sm text-white/48">这里是简要的说明小字...</p>
            <div className="mt-8 grid grid-cols-2 gap-3 rounded-xl bg-black/14 p-3">
              <Metric label="参与人次" value="0,000.00" />
              <Metric label="板块总量" value="0,000.00" />
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function LaunchpadPage() {
  return (
    <ProjectListPage
      title="TOKEN 打新"
      tabs={["正在进行", "已经结束", "我的打新订单"]}
      cards={launchpadCards}
      modalTitle="RWA Token 打新"
      modalFields={["参与期次", "期次和名称", "打新额度", "支付方式"]}
      confirmText="确认支付"
    />
  );
}

export function FinancePage() {
  return (
    <ProjectListPage
      title="Token 金融"
      tabs={["正在进行", "已经结束", "我的金融"]}
      cards={financeCards}
      modalTitle="Token 金融服务"
      modalFields={["参与期次", "期次和名称", "认筹额度", "支付方式"]}
      confirmText="确认支付"
    />
  );
}

export function StakingPage() {
  return (
    <ProjectListPage
      title="Staking"
      tabs={["正在进行", "已经结束", "我的Staking"]}
      cards={stakingCards}
      modalTitle="Staking 服务"
      modalFields={["参与期次", "期次和名称", "质押额度", "支付方式"]}
      confirmText="确认质押"
    />
  );
}

export function BrandTokenPage() {
  return (
    <PageShell eyebrow="RWA LIST" title="品牌Token专区">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {brandTokenCards.map((item) => (
          <article className="rounded-2xl bg-white/[0.13] p-5" key={item.id}>
            <LogoTile label="品牌Token名称" />
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-black/14 p-3">
              <Metric label="发行总量" value={item.supply} />
              <Metric label="当前价格" value={item.price} />
            </div>
            <AppButton className="mt-5" size="sm">
              详情
            </AppButton>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function HnbPoolPage() {
  const [selectedPool, setSelectedPool] = useState<PoolCardItem | null>(null);

  return (
    <PageShell eyebrow="HNB矿池" title="HNB矿池">
      <HeroPanel title="Banner和广告语" buttonText="购买产品" />
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["矿池品类", "0,000.00"],
          ["设备总量", "0,000.00"],
          ["产出价值", "0,000.00"],
          ["参与人次", "0,000.00"]
        ].map(([label, value]) => (
          <div className="rounded-2xl bg-white/[0.13] p-5" key={label}>
            <Metric label={label} value={value} />
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {poolCards.map((item) => (
          <PoolCard item={item} key={item.id} onBind={() => setSelectedPool(item)} />
        ))}
      </div>
      <DetailModal isOpen={Boolean(selectedPool)} onClose={() => setSelectedPool(null)} title="HNB矿池">
        {selectedPool ? <PoolBindForm item={selectedPool} onCancel={() => setSelectedPool(null)} /> : null}
      </DetailModal>
    </PageShell>
  );
}

export function MyPoolPage() {
  const [selectedPool, setSelectedPool] = useState<PoolCardItem | null>(null);

  return (
    <PageShell eyebrow="HNB矿池" title="我的矿池">
      <div className="flex flex-wrap gap-3">
        {["正在挖矿", "已经结束", "仪表"].map((item) => (
          <span className="rounded-full bg-white/[0.13] px-4 py-2 text-sm font-semibold text-white/76" key={item}>
            {item}
          </span>
        ))}
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {poolCards.map((item) => (
          <PoolCard item={item} key={item.id} onBind={() => setSelectedPool(item)} />
        ))}
      </div>
      <DetailModal isOpen={Boolean(selectedPool)} onClose={() => setSelectedPool(null)} title="HNB矿池">
        {selectedPool ? <PoolBindForm item={selectedPool} onCancel={() => setSelectedPool(null)} /> : null}
      </DetailModal>
    </PageShell>
  );
}

function ProjectListPage({
  cards,
  confirmText,
  modalFields,
  modalTitle,
  tabs,
  title
}: {
  cards: ProjectCard[];
  confirmText: string;
  modalFields: string[];
  modalTitle: string;
  tabs: string[];
  title: string;
}) {
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);

  return (
    <PageShell eyebrow="RWA LIST" title={title}>
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <span className="rounded-full bg-white/[0.13] px-4 py-2 text-sm font-semibold text-white/76" key={tab}>
            {tab}
          </span>
        ))}
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {cards.map((card, index) => (
          <ProjectCardView card={card} key={`${card.title}-${index}`} onOpen={() => setSelectedProject(card)} />
        ))}
      </div>
      <DetailModal isOpen={Boolean(selectedProject)} onClose={() => setSelectedProject(null)} title={modalTitle}>
        {selectedProject ? (
          <ProjectParticipationForm
            card={selectedProject}
            confirmText={confirmText}
            fields={modalFields}
            onCancel={() => setSelectedProject(null)}
          />
        ) : null}
      </DetailModal>
    </PageShell>
  );
}

function ProjectCardView({ card, onOpen }: { card: ProjectCard; onOpen: () => void }) {
  const Icon = card.icon;
  return (
    <article className="rounded-2xl bg-white/[0.13] p-5">
      <div className="flex items-start justify-between gap-4">
        <Icon className="h-7 w-7 text-hnb" />
        {card.progress ? <span className="rounded-full bg-hnb/10 px-3 py-1 text-xs font-bold text-hnb">本期额度 {card.progress}</span> : null}
      </div>
      <h2 className="mt-8 text-xl font-black">{card.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/48">{card.copy}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-black/14 p-3 md:grid-cols-4">
        {card.stats.map((item) => (
          <Metric key={item.label} {...item} />
        ))}
      </div>
      <AppButton className="mt-5" onClick={onOpen} size="sm">
        查看详情
      </AppButton>
    </article>
  );
}

function PoolCard({
  item,
  onBind
}: {
  item: PoolCardItem;
  onBind: () => void;
}) {
  return (
    <article className="rounded-2xl bg-white/[0.13] p-5">
      <Pickaxe className="h-7 w-7 text-hnb" />
      <h2 className="mt-8 text-xl font-black">{item.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/48">{item.copy}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-black/14 p-3 md:grid-cols-4">
        <Metric label="HNB产出Token" value={item.output} unit={item.token} />
        <Metric label="算力产量" value={item.power} />
        <Metric label="产出时长" value={item.duration} unit="Day" />
        <Metric label="产出总值" value={item.total} />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <AppButton onClick={onBind} size="sm">
          绑定矿池
        </AppButton>
        <AppButton size="sm">购买产品</AppButton>
      </div>
    </article>
  );
}

function ProjectParticipationForm({
  card,
  confirmText,
  fields,
  onCancel
}: {
  card: ProjectCard;
  confirmText: string;
  fields: string[];
  onCancel: () => void;
}) {
  const Icon = card.icon;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="rounded-2xl bg-white/[0.08] p-5">
        <Icon className="h-8 w-8 text-hnb" />
        <h3 className="mt-5 text-xl font-black">{card.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/52">{card.copy}</p>
        <div className="mt-5 grid gap-3 rounded-xl bg-black/20 p-4">
          <Metric label="本期总量" value={card.stats[0]?.value ?? "0,000.00"} />
          <Metric label="本期价格" value={card.stats[2]?.value ?? "0,000.00"} />
          <Metric label="释放周期" value="000" unit="day" />
        </div>
      </div>
      <div className="grid gap-4">
        {fields.map((field) => (
          <label className="block" key={field}>
            <span className="mb-2 block text-sm font-semibold text-white/58">{field}</span>
            <div className="h-11 rounded-xl bg-white/[0.11] px-4 text-sm leading-11 text-white/38">
              {field.includes("额度") ? "请输入您要参与的额度" : `请选择${field}`}
            </div>
          </label>
        ))}
        <div className="grid gap-3 rounded-xl bg-black/20 p-4 sm:grid-cols-2">
          <Metric label="账户余额" value="0.0000" unit="USD" />
          <Metric label="预计收益" value="0,000.00" unit="HNB" />
        </div>
        <div className="flex flex-wrap gap-3">
          <AppButton onClick={onCancel} size="sm">
            取消返回
          </AppButton>
          <AppButton size="sm">{confirmText}</AppButton>
        </div>
        <p className="text-xs leading-5 text-white/42">我已阅读并知晓服务内容及规则【XXXXXXX】，同意所有服务条款。</p>
      </div>
    </div>
  );
}

function PoolBindForm({ item, onCancel }: { item: PoolCardItem; onCancel: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="rounded-2xl bg-white/[0.08] p-5">
        <Pickaxe className="h-8 w-8 text-hnb" />
        <h3 className="mt-5 text-xl font-black">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/52">{item.copy}</p>
        <div className="mt-5 grid gap-3 rounded-xl bg-black/20 p-4">
          <Metric label="当前APY" value="00.00%" />
          <Metric label="产出时长" value={item.duration} unit="Day" />
          <Metric label="产出总值" value={item.total} unit={item.token} />
        </div>
      </div>
      <div className="grid gap-4">
        {["产品信息", "期次和名称", "绑定设备", "预计收益"].map((field) => (
          <label className="block" key={field}>
            <span className="mb-2 block text-sm font-semibold text-white/58">{field}</span>
            <div className="h-11 rounded-xl bg-white/[0.11] px-4 text-sm leading-11 text-white/38">
              {field === "预计收益" ? "0,000.00 HNB" : `请选择${field}`}
            </div>
          </label>
        ))}
        <div className="grid gap-3 rounded-xl bg-black/20 p-4 sm:grid-cols-2">
          <Metric label="HNB产出Token" value={item.output} unit={item.token} />
          <Metric label="算力产量" value={item.power} />
        </div>
        <div className="flex flex-wrap gap-3">
          <AppButton onClick={onCancel} size="sm">
            取消返回
          </AppButton>
          <AppButton size="sm">确认绑定</AppButton>
        </div>
        <p className="text-xs leading-5 text-white/42">我已阅读并知晓矿池绑定服务内容及规则【XXXXXXX】，同意所有服务条款。</p>
      </div>
    </div>
  );
}

function HeroPanel({ buttonText, title }: { buttonText: string; title: string }) {
  return (
    <section className="rounded-2xl border border-white/14 bg-white/[0.055] p-5 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-5">
      <div className="flex min-h-[210px] flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black leading-snug tracking-normal">{title}</h2>
          <p className="mt-5 text-sm leading-6 text-white/52">广告语，最多2行，超出的省略...最多2行，超出的省略...</p>
        </div>
        <AppButton className="mt-6 w-fit" size="lg">
          {buttonText}
        </AppButton>
      </div>
      <div className="mt-5 grid min-h-[210px] place-items-center rounded-xl bg-white/24 lg:mt-0">
        <ImageIcon className="h-8 w-8 text-white/42" />
      </div>
    </section>
  );
}

function LogoTile({ label }: { label: string }) {
  return (
    <div className="rounded-xl bg-white/[0.13] p-4 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/10">
        <Package className="h-5 w-5 text-white/48" />
      </div>
      <p className="mt-3 text-xs font-semibold text-white/62">{label}</p>
    </div>
  );
}

function Metric({ label, unit, value }: Metric) {
  return (
    <div>
      <strong className="block text-lg font-black tracking-normal text-white">{value}</strong>
      <span className="mt-1 block text-xs font-semibold text-white/44">
        {label}
        {unit ? ` / ${unit}` : ""}
      </span>
    </div>
  );
}
