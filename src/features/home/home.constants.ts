import {
  BadgeDollarSign,
  Gem,
  Handshake,
  HelpCircle,
  Landmark,
  Megaphone,
  Pickaxe,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon
} from "lucide-react";

export const stats = [
  ["链上资产", "0,000.00", "USDT"],
  ["参与人次", "0,000.00", "Users"],
  ["板块总量", "0,000.00", "HNB"],
  ["打新规模", "0,000.00", "USDT"],
  ["矿池算力", "0,000.00", "HNB"],
  ["品牌资产", "0,000.00", "Token"]
] as const;

export type HomeCard = {
  title: string;
  copy: string;
  icon: LucideIcon;
};

export const sectorCards: HomeCard[] = [
  {
    title: "RWA Token 打新专区",
    copy: "这里是简要的说明小字...",
    icon: Sparkles
  },
  {
    title: "RWA Token 金融板块",
    copy: "这里是简要的说明小字...",
    icon: Landmark
  },
  {
    title: "Staking专区",
    copy: "这里是简要的说明小字...",
    icon: ShieldCheck
  },
  {
    title: "品牌Token专区",
    copy: "这里是简要的说明小字...",
    icon: Gem
  }
];

export const activityCards = [
  {
    title: "活动标题，不分语言，最多2行，超出省略...",
    copy: "活动概要和注解一句话 ...",
    prize: "0,000.00",
    popularity: "0,000.00"
  },
  {
    title: "活动标题，不分语言，最多2行，超出省略...",
    copy: "活动概要和注解一句话 ...",
    prize: "0,000.00",
    popularity: "0,000.00"
  }
];

export const productCards = [
  {
    title: "实物商城",
    icon: Store
  },
  {
    title: "众筹广场",
    icon: Rocket
  },
  {
    title: "NFT商城",
    icon: Gem
  }
];

export const financeCards = [
  {
    title: "Token 金融产品",
    copy: "收益、流动性和项目进度集中展示。",
    icon: BadgeDollarSign
  },
  {
    title: "Staking 质押池",
    copy: "质押周期、预计收益和参与状态一屏扫清。",
    icon: ShieldCheck
  },
  {
    title: "RWA 收益组合",
    copy: "围绕真实世界资产组织金融产品。",
    icon: Landmark
  }
];

export const miningCards = [
  {
    label: "矿池总量",
    value: "0,000.00",
    unit: "HNB"
  },
  {
    label: "我的收益",
    value: "0,000.00",
    unit: "HNB"
  },
  {
    label: "参与人次",
    value: "0,000.00",
    unit: "Users"
  }
];

export const communityCards = [
  {
    title: "社区星球",
    copy: "创意动图、活动动态和社区内容集中展示。",
    icon: Megaphone
  },
  {
    title: "HNB矿池",
    copy: "绑定矿池、查看收益和参与状态。",
    icon: Pickaxe
  }
];

export const brandCards = Array.from({ length: 10 }, (_, index) => ({
  title: "品牌LOGO/微官网",
  id: `brand-${index + 1}`
}));

export const qaCards = [
  {
    title: "Q&A",
    copy: "围绕 RWA 上链、Token 发行和资产参与流程提供常见问题入口。",
    icon: HelpCircle
  },
  {
    title: "合作服务",
    copy: "为实体电子商城提供 RWA 上链的最佳解决方案 ...",
    icon: Handshake
  }
];
