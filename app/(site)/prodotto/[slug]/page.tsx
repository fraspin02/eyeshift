import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { PRODUCT } from "@/lib/data/product";

export function generateStaticParams() {
  return [{ slug: PRODUCT.slug }];
}

export const dynamicParams = false;

export const metadata: Metadata = {
  title: PRODUCT.name,
  description: PRODUCT.tagline,
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== PRODUCT.slug) notFound();
  return (
    <main id="main" className="bg-obsidian">
      <ProductDetail />
    </main>
  );
}
