import {
  Bell,
  CalendarDays,
  CircleUserRound,
  Home,
  ListTree,
  Pickaxe,
  Repeat2,
  Store,
  type LucideIcon
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export const sidebarNavigationItems: NavigationItem[] = [
  {
    label: "平台首页",
    href: "/",
    icon: Home
  },
  {
    label: "品牌商城",
    href: "/market",
    icon: Store,
    children: [
      {
        label: "实物商城",
        href: "/market/physical"
      },
      {
        label: "众筹广场",
        href: "/market/crowdfunding"
      },
      {
        label: "NFT商城",
        href: "/market/nft"
      }
    ]
  },
  {
    label: "RWA LIST",
    href: "/rwa-list",
    icon: ListTree,
    children: [
      {
        label: "Token 打新",
        href: "/rwa-list/launchpad"
      },
      {
        label: "Token 金融",
        href: "/rwa-list/finance"
      },
      {
        label: "Staking",
        href: "/rwa-list/staking"
      },
      {
        label: "品牌Token专区",
        href: "/rwa-list/brand-token"
      }
    ]
  },
  {
    label: "HNB矿池",
    href: "/hnb-pool",
    icon: Pickaxe,
    children: [
      {
        label: "矿池首页",
        href: "/hnb-pool"
      },
      {
        label: "我的矿池",
        href: "/hnb-pool/my-pool"
      }
    ]
  },
  {
    label: "活动广场",
    href: "/activities",
    icon: CalendarDays,
    disabled: true
  },
  {
    label: "SWAP",
    href: "/swap",
    icon: Repeat2,
    disabled: true
  },
  {
    label: "系统公告",
    href: "/announcements",
    icon: Bell,
    disabled: true
  },
  {
    label: "个人中心",
    href: "/profile",
    icon: CircleUserRound,
    disabled: true
  },
  {
    label: "星球广场",
    href: "/community",
    icon: ListTree,
    disabled: true
  }
];
