'use client';

import { useGlobalContext } from "@/app/context/store";
import { ShopifyProduct } from "../lib/shopify";
import { CustomImage } from "../Components/Image/Image";
import Link from "next/link";

export const ProductGrid = ({ products }: { products?: ShopifyProduct[] }) => {

    const { isFilteredShop } = useGlobalContext();
    products = isFilteredShop === null ?
        products?.filter((p) => !(Array.isArray(p.tags) && p.tags.includes("Featured"))) :
        products?.filter((p) => (Array.isArray(p.collections) && p.collections.includes(isFilteredShop)));

    const pattern = [2, 4, 4, 2, 2, 4, 4, 2, 2, 4, 4, 2];

    const fallback = (products && products.length > 0) ? products : Array.from({ length: 8 }).map((_, idx) => ({
        id: String(idx),
        title: idx === 0 ? "NO HARD FEELINGS CHAIR" : `PRODUCT ${idx + 1}`,
        handle: undefined as string | undefined,
        images: Array.from({ length: 4 }).map(() => "/images/chair1.png"),
        price: "€ 3.500",
    }));

    const cells: { productIndex: number; imageIndex: number; imageUrl?: string }[] = [];
    fallback.forEach((p, i) => {
        const span = pattern[i % pattern.length];
        const imagesCount = span === 4 ? 4 : 2;
        for (let j = 0; j < imagesCount; j++) {
            cells.push({ productIndex: i, imageIndex: j, imageUrl: p.metafields?.plp_images?.[j] });
        }
    });

    return (
        <div className="grid grid-cols-6 gap-x-[10px] gap-y-[25px] px-4">
            {cells.map((c) => {
                const p = fallback[c.productIndex];
                const isFirstImageOfProduct = c.imageIndex === 0;
                const isSecondImageOfProduct = c.imageIndex === 1;
                const img = c.imageUrl || "/images/placeholder.png";

                return (
                    <div key={`${c.productIndex}-${c.imageIndex}`} className="relative">
                        <div className="aspect-[228/343] relative overflow-hidden">
                            {p.handle ? (
                                <Link href={`/products/${p.handle}`}>
                                    <div className="w-full h-full">
                                        <CustomImage alt={`${p.title} ${c.imageIndex + 1}`} src={img} className="w-full h-full object-cover" />
                                    </div>
                                </Link>
                            ) : (
                                <div className="w-full h-full">
                                    <CustomImage alt={`${p.title} ${c.imageIndex + 1}`} src={img} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        {isFirstImageOfProduct && (
                            <p className="mt-2 z-2 text-black">{p.title}</p>
                        )}
                        {isSecondImageOfProduct && (
                            <p className="mt-2 z-2 text-black">{p.price}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


export const HighlightedProduct = ({ products }: { products?: ShopifyProduct[] }) => {
    const { isFilteredShop } = useGlobalContext();
    return products && products.length > 0 && isFilteredShop === null ? (
        products
            .filter((product) => Array.isArray(product.tags) && product.tags.includes("Featured"))
            .map((product: ShopifyProduct) => (
                <Link href={`/products/${product.handle}`} key={product.id}>
                    <div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 px-4 mb-[10px]">
                            <div className="col-span-1 lg:col-start-2 flex items-center">
                                <p>NO HARD FEELINGS IS CRAFTED FROM LOCALLY SOURCED SWEDISH OAK, CHOSEN FOR ITS NATURAL CHARM AND DURABILITY. EACH PIECE REFLECTS THE LEGACY OF ITS TREE, REVEALED IN UNIQUE AND EXPRESSIVE GRAIN PATTERNS .</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 px-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-[228/343] relative">
                                    <CustomImage
                                        alt=""
                                        src="/images/chair1.png"
                                        className="w-full h-full object-cover"
                                    />
                                    {i === 0 && (
                                        <p className="absolute mt-[10px] left-0">{product.title}</p>
                                    )}
                                    {i === 1 && (
                                        <p className="absolute mt-[10px] left-0">{product.price}</p>
                                    )}
                                    {i === 2 && (
                                        <p className="absolute mt-[10px] left-0">HANDCRAFTED IN SWEDEN</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Link>
            ))
    ) : (
        null
    )
}