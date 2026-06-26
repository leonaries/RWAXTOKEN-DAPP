import { MarketPage } from "@/features/prototype-pages/page-shell";

const categoryNames: Record<string, string> = {
  crowdfunding: "众筹广场",
  nft: "NFT商城",
  physical: "实物商城"
};

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return <MarketPage category={categoryNames[category] || "全部商品"} />;
}
