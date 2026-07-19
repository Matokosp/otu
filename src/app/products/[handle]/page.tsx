import { Metadata } from "next";
import { getProductByHandle } from "../../lib/shopify";
import { Product as ProductClient } from "../../Components/Product/Product";
import Menu from "../../Components/Menu/Menu";
import Link from "next/link";
import { Typing } from "../../Components/Typing/Typing";
import { getServerRegion, getRegionCountry, INTERNATIONAL_COUNTRIES } from "../../lib/market";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle).catch(() => null);

  if (!product) {
    return { title: "Product not found - OF THE USELESS" };
  }

  const description =
    product.metafields?.description ||
    product.metafields?.featured_description ||
    "OF THE USELESS is an independent brand based in Stockholm, Sweden.";
  const image = product.images?.[0];

  return {
    title: `${product.title} - OF THE USELESS`,
    description,
    openGraph: {
      url: `https://oftheuseless.com/products/${product.handle}`,
      title: `${product.title} - OF THE USELESS`,
      description,
      siteName: "OF THE USELESS",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const awaitParams = await params;
  const region = await getServerRegion();
  const country = getRegionCountry(region);
  const product = await getProductByHandle(awaitParams.handle, 60, country).catch(() => null);

  if (!product) {
    return (
      <main className="relative min-h-[calc(100vh-716px)]">
        <Menu page />
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-[10px] px-[10px] mt-[calc(50svh-40px)] uppercase">
          <div className="col-span-4 lg:col-start-4 lg:col-end-9 flex flex-col gap-y-[20px]">
            <p>Product not found.</p>
            <Link href="/shop" className="underline">
              <Typing text="Back to shop" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [amount, currency] = (product.price || "").split(" ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.metafields?.description || undefined,
    image: product.images,
    offers: amount
      ? {
          "@type": "Offer",
          priceCurrency: currency,
          price: amount,
          availability: product.availableForSale === false
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
          url: `https://oftheuseless.com/products/${product.handle}`,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient productData={product} isInternational={INTERNATIONAL_COUNTRIES.includes(country)} />
    </>
  );
}
