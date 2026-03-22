import { getProductByHandle } from "../../lib/shopify";
import { Product as ProductClient } from "../../Components/Product/Product";
import Link from "next/link";

type Props = { params: { handle: string } };

export default async function ProductPage({ params }: Props) {
  const awaitParams = await params;
  const product = await getProductByHandle(awaitParams.handle).catch(() => null);

  if (!product) {
    return (
      <main className="p-8">
        <p>Product not found.</p>
        <Link href="/shop">Back to shop</Link>
      </main>
    );
  }

  return <ProductClient productData={product} />;
}
