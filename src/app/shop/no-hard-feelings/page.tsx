import { Product } from "@/app/Components/Product/Product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NO HARD FEELINGS | CHAIR - OF THE USELESS",
  description:
    "NO HARD FEELINGS is crafted from locally sourced Swedish oak, chosen for its natural charm and durability. Each piece reflects the legacy of its tree, revealed in unique and expressive grain patterns.",
  icons: {
    icon: "/images/icon/favicon.ico",
    apple: "/images/icon/apple-touch-icon.png",
  },
  openGraph: {
    url: "https://oftheuseless.com/shop/no-hard-feelings",
    title: "NO HARD FEELINGS | CHAIR - OF THE USELESS",
    description:
      "NO HARD FEELINGS is crafted from locally sourced Swedish oak, chosen for its natural charm and durability. Each piece reflects the legacy of its tree, revealed in unique and expressive grain patterns.",
    siteName: "NO HARD FEELINGS | CHAIR - OF THE USELESS",
    images: [
      {
        url: "/images/meta/hero_image.jpg",
      },
    ],
  },
};

export default function Page() {
  return (
    <div className="relative">
      <Product />
    </div>
  );
}
