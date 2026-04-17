'use client';

import { useGlobalContext } from "@/app/context/store";
import { ShopifyProduct } from "../lib/shopify";
import { CustomImage } from "../Components/Image/Image";
import Link from "next/link";
import { formatPrice } from "../lib/formatPrice";

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
        metafields: {
            plp_images: Array.from({ length: 4 }).map(() => "/images/placeholder.png")
        },
        availableForSale: true,
    }));

    const cells: { productIndex: number; imageIndex: number; imageUrl?: string; isExtra: boolean }[] = [];

    fallback.forEach((p, i) => {
        const span = pattern[i % pattern.length];
        const imagesCount = span === 4 ? 4 : 2;
        for (let j = 0; j < imagesCount; j++) {
            cells.push({
                productIndex: i,
                imageIndex: j,
                imageUrl: p.metafields?.plp_images?.[j],
                isExtra: j >= 2 // images 3 & 4 are extras, hidden on mobile
            });
        }
    });

    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-[10px] gap-y-[25px] px-[10px]">
            {cells.map((c) => {
                const p = fallback[c.productIndex];
                const isFirstImageOfProduct = c.imageIndex === 0;
                const isSecondImageOfProduct = c.imageIndex === 1;
                const img = c.imageUrl || "/images/placeholder.png";

                return (
                    <div
                        key={`${c.productIndex}-${c.imageIndex}`}
                        className={`relative ${c.isExtra ? "hidden lg:block" : ""}`}
                    >
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
                            <p className="mt-2 z-2 text-black uppercase">{p.title}</p>
                        )}
                        {isSecondImageOfProduct && (
                            <p className="mt-2 z-2 text-black text-right lg:text-left flex justify-between"><span className="uppercase text-[rgba(0,0,0,0.5)]">{!p.availableForSale ? 'out of stock' : ''}</span>{p.price && formatPrice(p.price)}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


export const HighlightedProduct = ({ products }: { products?: ShopifyProduct[] }) => {
    const { isFilteredShop } = useGlobalContext();
    const featuredProducts = products?.filter((product) => Array.isArray(product.tags) && product.tags.includes("Featured"));
    return products && products.length > 0 && isFilteredShop === null ? (
        products
            .filter((product) => Array.isArray(product.tags) && product.tags.includes("Featured"))
            .map((product: ShopifyProduct) => (
                <Link href={`/products/${product.handle}`} key={product.id}>
                    <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-3 px-[10px] mb-[10px]">
                        <div className="col-span-1 lg:col-start-2 flex items-center">
                            <p className="uppercase">{product.metafields?.featured_description}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-6 px-[10px]">
                        {product.metafields?.plp_images?.map((img, i) => (
                            <div key={i} className="aspect-[228/343] relative">
                                <CustomImage
                                    alt=""
                                    src={img}
                                    className="w-full h-full object-cover"
                                />
                                {i === 0 && (
                                    <p className="hidden lg:block absolute mt-[10px] left-0">{product.title}</p>
                                )}
                                {i === 1 && (
                                    <p className="hidden lg:block absolute mt-[10px] left-0">{product.price && formatPrice(product.price)}</p>
                                )}
                                {i === 2 && (
                                    <p className="hidden lg:block absolute mt-[10px] left-0">HANDCRAFTED IN SWEDEN</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-[10px] mt-[10px] lg:hidden">
                        <p className="uppercase">{product.title}</p>
                        <p>{product.price && formatPrice(product.price)}</p>
                    </div>
                </Link>
            ))
    ) : (
        null
    )
}