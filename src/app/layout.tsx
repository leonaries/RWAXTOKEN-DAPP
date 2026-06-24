import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RWAXTOKEN-DAPP",
  description: "RWA token launch, finance, staking, mining pool and brand token dapp."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
