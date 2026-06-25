"use client";

/**
 * 钱包配置
 * 基于 public/assets/icons/wallets 目录的钱包图标
 */

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// 所有支持的钱包（基于图标文件）
export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/assets/icons/wallets/metamask-icon.png',
    description: '最流行的以太坊钱包'
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: '/assets/icons/wallets/okx-icon.png',
    description: 'OKX 交易所官方钱包'
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '/assets/icons/wallets/trust-icon.png',
    description: '安全的多链钱包'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/assets/icons/wallets/coinbase-icon.png',
    description: 'Coinbase 官方钱包'
  },
  {
    id: 'tokenpocket',
    name: 'TokenPocket',
    icon: '/assets/icons/wallets/tokenpocket-icon.png',
    description: '多链钱包'
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: '/assets/icons/wallets/rabby-icon.png',
    description: '多链浏览器钱包'
  },
  {
    id: 'zerion',
    name: 'Zerion',
    icon: '/assets/icons/wallets/zerion-icon.png',
    description: 'DeFi 智能钱包'
  }
];

/**
 * 获取所有钱包
 */
export function getAllWallets(): WalletInfo[] {
  return SUPPORTED_WALLETS;
}

/**
 * 根据 ID 获取钱包信息
 */
export function getWalletById(id: string): WalletInfo | undefined {
  return SUPPORTED_WALLETS.find((wallet) => wallet.id === id);
}
