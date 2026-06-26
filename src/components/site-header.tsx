"use client";

import { AppButton } from "@/components/app-button";
import { WalletStatus } from "@/components/auth/wallet-status";
import { BrandLogo } from "@/components/brand-logo";
import { sidebarNavigationItems } from "@/config/navigation";
import { ChevronDown, ExternalLink, Instagram, Menu, Send, X, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

const AUTH_ROUTES = ["/login", "/auth/callback"];

type SiteHeaderProps = {
  children: ReactNode;
};

export function SiteHeader({ children }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldHideHeader = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (shouldHideHeader) {
    return <>{children}</>;
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-ink text-white lg:pl-[292px]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[292px] border-r border-white/10 bg-ink px-7 py-8 lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} onNavigate={closeMenu} />
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/10 bg-ink/92 px-5 backdrop-blur sm:px-8 lg:left-[292px] lg:justify-end lg:px-10">
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/16 lg:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          type="button"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <WalletStatus />
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="关闭菜单"
            className="absolute inset-0 h-full w-full bg-black/58"
            onClick={closeMenu}
            type="button"
          />
          <aside className="relative flex h-full w-[292px] max-w-[84vw] flex-col bg-ink px-6 py-7 shadow-2xl">
            <SidebarContent pathname={pathname} onNavigate={closeMenu} />
          </aside>
        </div>
      ) : null}

      <div className="pt-[72px]">{children}</div>
    </div>
  );
}

type SidebarContentProps = {
  onNavigate: () => void;
  pathname: string;
};

function SidebarContent({ onNavigate, pathname }: SidebarContentProps) {
  const [expandedItems, setExpandedItems] = useState(
    () => new Set(sidebarNavigationItems.filter((item) => item.children).map((item) => item.href))
  );

  const toggleExpandedItem = (href: string) => {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  };

  return (
    <>
      <Link
        aria-label="RWAXTOKEN 平台首页"
        className="mb-7 flex h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-black text-white"
        href="/"
        onClick={onNavigate}
      >
        <BrandLogo
          className="flex items-center justify-center gap-3"
          iconClassName="h-5 w-5 text-cyanweb"
          markClassName="grid h-8 w-8 place-items-center rounded-lg bg-black text-white"
          textClassName="text-base font-black tracking-wide text-white"
        />
      </Link>

      <nav aria-label="左侧主导航" className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-2">
          {sidebarNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const isExpanded = expandedItems.has(item.href);
            const isDisabled = item.disabled && !item.children;
            const itemClassName = `flex h-10 w-full items-center gap-2.5 rounded-full px-3 text-left text-sm font-semibold transition ${
              isDisabled
                ? "cursor-not-allowed text-white/34"
                : isActive
                  ? "bg-hnb/10 text-hnb"
                  : "text-white/78 hover:bg-white/8 hover:text-hnb"
            }`;
            const iconClassName = `grid h-6 w-6 shrink-0 place-items-center rounded-full ${
              isDisabled ? "bg-white/5 text-white/26" : isActive ? "bg-hnb text-ink" : "bg-white/10 text-mutedText"
            }`;

            return (
              <div key={item.href}>
                {item.children ? (
                  <button
                    aria-controls={`sidebar-group-${item.href.replaceAll("/", "-") || "home"}`}
                    aria-expanded={isExpanded}
                    className={itemClassName}
                    onClick={() => toggleExpandedItem(item.href)}
                    type="button"
                  >
                    <span className={iconClassName}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-current/58 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : isDisabled ? (
                  <button className={itemClassName} disabled type="button">
                    <span className={iconClassName}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                ) : (
                  <Link className={itemClassName} href={item.href} onClick={onNavigate}>
                    <span className={iconClassName}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </Link>
                )}

                {item.children && isExpanded ? (
                  <div
                    className="space-y-1 py-2 pl-12"
                    id={`sidebar-group-${item.href.replaceAll("/", "-") || "home"}`}
                  >
                    {item.children.map((child) => (
                      <Link
                        className={`block rounded-md px-1 py-1 text-[13px] font-medium transition hover:text-hnb ${
                          pathname.startsWith(child.href) ? "text-hnb" : "text-white/58"
                        }`}
                        href={child.href}
                        key={child.href}
                        onClick={onNavigate}
                      >
                        · {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="mt-7 shrink-0">
        <AppButton
          className="w-full rounded-2xl text-2xl font-black"
          href="/"
          rightIcon={<ExternalLink className="h-5 w-5" />}
          size="xl"
        >
          官网
        </AppButton>
        <p className="mt-5 text-center text-[10px] leading-5 text-white/62">
          All Rights Reserved 2025~2026
          <br />© Rwaxtoken.com
        </p>
        <p className="mt-4 text-center text-xs font-bold text-white/70">Official social media</p>
        <div className="mt-3 flex justify-center gap-2">
          {[Send, Instagram, Youtube].map((Icon, index) => (
            <span
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/34 text-white/80"
              key={index}
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
