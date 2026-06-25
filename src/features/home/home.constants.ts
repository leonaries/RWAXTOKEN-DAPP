import { Gem, Landmark, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

export const navItems = [
  "RWA LIST",
  "Token打新",
  "Token金融",
  "Staking",
  "品牌Token",
  "HNB矿池",
  "活动广场",
  "社区星球"
];

export const stats = [
  ["链上资产", "0,000.00", "USDT"],
  ["参与人次", "0,000.00", "Users"],
  ["板块总量", "0,000.00", "HNB"]
] as const;

export type FeatureCard = {
  title: string;
  copy: string;
  icon: LucideIcon;
};

export const featureCards: FeatureCard[] = [
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

export const productCards = ["实物商城", "众筹广场", "NFT商城"];
