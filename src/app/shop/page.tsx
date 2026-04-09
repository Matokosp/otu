import { Metadata } from "next";
import Menu from "../Components/Menu/Menu";
import Link from "next/link";
import { CustomImage } from "../Components/Image/Image";
import { getAllProducts, ShopifyProduct, getCollections, collectionsType } from "../lib/shopify";
import { HighlightedProduct, ProductGrid } from "./ProductGrid";

export const metadata: Metadata = {
    title: "Shop - OF THE USELESS",
    description:
        "Shop our collection of meticulously crafted pieces, each a testament to the artistry and dedication that defines OF THE USELESS. Explore our range of unique designs, where every piece tells a story of craftsmanship and creativity.",
    icons: {
        icon: "/images/icon/favicon.ico",
        apple: "/images/icon/apple-touch-icon.png",
    },
    openGraph: {
        url: "https://oftheuseless.com/shop",
        title: "Shop - OF THE USELESS",
        description:
            "Shop our collection of meticulously crafted pieces, each a testament to the artistry and dedication that defines OF THE USELESS. Explore our range of unique designs, where every piece tells a story of craftsmanship and creativity.",
        siteName: "Shop - OF THE USELESS",
        images: [
            {
                url: "/images/meta/hero_image.jpg",
            },
        ],
    },
};

export default async function Page() {
    const allProducts: ShopifyProduct[] = await getAllProducts().catch((e) => { console.log("Error fetching products:", e); return []; });
    const collections: collectionsType[] = await getCollections().catch((e) => { console.log("Error fetching collections:", e); return []; });

    const filteredCollections = collections.filter((collection) => collection.description);

    return (
        <main className="relative">
            <Menu page shop />
            {/* LOGO */}
            <div className="w-[calc(100vw/12*2)] px-[10px] grid fixed z-[99] translate-y-[-50%] lg:block top-[50svh]">
                <div className="pl-[10%] min-w-[180px]">
                    <Link href={"/"}>
                        <CustomImage alt="" src="/images/logo.svg" className="w-full" />
                    </Link>
                </div>
            </div>

            <div className="flex flex-col lg:gap-y-[165px] gap-y-[100px]">
                <HighlightedProduct products={allProducts} />

                {/* ALL PRODUCTS */}
                <div>
                    <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-3 px-[10px] mb-[10px]">
                        <div className="col-span-1 lg:col-start-2 flex items-center">
                            <p className="uppercase">{filteredCollections[0].description}</p>
                        </div>
                    </div>
                    <ProductGrid products={allProducts} />
                </div>
            </div>
        </main>
    );
}
