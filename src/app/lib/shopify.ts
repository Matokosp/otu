type ShopifyProduct = {
  id: string;
  title: string;
  handle?: string;
  images: string[];
  price?: string;
  tags: string[];
  collections: string[];
  metafields: {
    plp_images?: string[];
    featured_description?: string;
    material_and_finish?: string;
    rarity?: string;
    description?: string;
    dimensions?: string;
    material_and_finish_description?: string;
    care?: string;
    shipping?: string;
    description_long?: string;
    description_long_image?: { url: any; altText: any; };
  } | null;
  quantityAvailable?: number | null;
  availableForSale?: boolean | null;
  currentlyNotInStock?: boolean | null;
  variantId?: string | null;
};

export type collectionsType = {
  id: string;
  title: string;
  description: string;
}

async function storefront(query: string, variables?: Record<string, any>, options?: { revalidate?: number }) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN env vars");
  }

  // Dev helper: optionally skip TLS verification when running behind a proxy
  if (process.env.SKIP_TLS_VERIFY === "true") {
    // eslint-disable-next-line no-console
    // console.warn("SKIP_TLS_VERIFY=true — disabling TLS certificate verification for outgoing requests (dev only)");
    // disable Node TLS verification (dev only)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const fetchOptions: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (typeof options?.revalidate === "number") {
    fetchOptions.next = { revalidate: options.revalidate };
  }

  const apiVersion = process.env.SHOPIFY_API_VERSION || "2023-10";
  const url = `https://${domain}/api/${apiVersion}/graphql.json`;

  const res = await fetch(url, fetchOptions);
  const json = await res.json();

  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function getProducts(first = 8): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          tags
          metafields
          images(first: 4) { nodes { url } }
          variants(first: 1) { nodes { price { amount currencyCode } } }
        }
      }
    }
  `;

  const data = await storefront(query, { first }, { revalidate: 60 });
  return data.products.nodes.map((p: any) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    images: (p.images?.nodes || []).map((n: any) => n.url),
    tags: p.tags,
    metafields: p.metafields,
    price:
      p.variants?.nodes?.[0]?.price?.amount && p.variants?.nodes?.[0]?.price?.currencyCode
        ? `${p.variants.nodes[0].price.amount} ${p.variants.nodes[0].price.currencyCode}`
        : undefined,
  }));
}

export async function getShopPolicies(): Promise<{
  privacyPolicy: { title: string; body: string } | null;
  refundPolicy: { title: string; body: string } | null;
  termsOfService: { title: string; body: string } | null;
}> {
  const query = `
    query getShopPolicies {
      shop {
        privacyPolicy { body title }
        refundPolicy { body title }
        termsOfService { body title }
      }
    }
  `;

  const data = await storefront(query, {}, { revalidate: 3600 });

  return {
    privacyPolicy: data.shop.privacyPolicy || null,
    refundPolicy: data.shop.refundPolicy || null,
    termsOfService: data.shop.termsOfService || null,
  };
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const pageSize = 50;
  let hasNext = true;
  let after: string | null = null;
  const all: ShopifyProduct[] = [];

  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        nodes {
          id
          title
          handle
          tags
          totalInventory
          metafields(identifiers: [
              { namespace: "custom", key: "plp_images" }
              { namespace: "custom", key: "featured_description" }
              { namespace: "custom", key: "material_and_finish" }
              { namespace: "custom", key: "rarity" }
              { namespace: "custom", key: "description" }
              { namespace: "custom", key: "dimensions" }
              { namespace: "custom", key: "material_and_finish_description" }
              { namespace: "custom", key: "care" }
              { namespace: "custom", key: "shipping" }
              { namespace: "custom", key: "description_long" }
              { namespace: "custom", key: "description_long_image" }
            ]) {
              namespace
              key
              type
              value

               references(first: 10) {
                nodes {
                  ... on MediaImage {
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
          }
          collections(first: $first, after: $after) { nodes { title id } }
          images(first: 4) { nodes { url } }
          variants(first: 1) {
            nodes {
              id
              price {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
              currentlyNotInStock
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  while (hasNext) {
    const variables: any = { first: pageSize };
    if (after) variables.after = after;

    const data = await storefront(query, variables, { revalidate: 60 });
    const nodes = data?.products?.nodes || [];

    nodes.forEach((p: any) => {

      const plpMetafield = p.metafields?.find((m: any) => m?.key === "plp_images");

      const imageUrls = plpMetafield?.references?.nodes
        ?.map((node: { image: { url: any; }; }) => node.image?.url)
        .filter(Boolean) || [];

      all.push({
        id: p.id,
        title: p.title,
        handle: p.handle,
        images: (p.images?.nodes || []).map((n: any) => n.url),
        tags: p.tags || [],
        collections: p.collections.nodes.map((c: any) => c.title) || [],
        metafields: {
          plp_images: imageUrls,
          material_and_finish: p.metafields?.filter((m: any) => m?.key === "material_and_finish")[0]?.value,
          featured_description: p.metafields?.filter((m: any) => m?.key === "featured_description")[0]?.value,
          rarity: p.metafields?.filter((m: any) => m?.key === "rarity")[0]?.value,
          description: p.metafields?.filter((m: any) => m?.key === "description")[0]?.value,
          dimensions: p.metafields?.filter((m: any) => m?.key === "dimensions")[0]?.value,
          material_and_finish_description: p.metafields?.filter((m: any) => m?.key === "material_and_finish_description")[0]?.value,
          care: p.metafields?.filter((m: any) => m?.key === "care")[0]?.value,
          shipping: p.metafields?.filter((m: any) => m?.key === "shipping")[0]?.value,
          description_long: p.metafields?.filter((m: any) => m?.key === "description_long")[0]?.value,
          description_long_image: p.metafields?.filter((m: any) => m?.key === "description_long_image")[0]?.nodes?.[0]?.image?.url,
        },
        price:
          p.variants?.nodes?.[0]?.price?.amount && p.variants?.nodes?.[0]?.price?.currencyCode
            ? `${p.variants.nodes[0].price.amount} ${p.variants.nodes[0].price.currencyCode}`
            : undefined,
        quantityAvailable: p.variants?.nodes?.[0]?.quantityAvailable,
        availableForSale: p.variants?.nodes?.[0]?.availableForSale,
        currentlyNotInStock: p.variants?.nodes?.[0]?.currentlyNotInStock,
      });
    });

    const pageInfo = data?.products?.pageInfo;
    hasNext = !!(pageInfo && pageInfo.hasNextPage);
    after = pageInfo ? pageInfo.endCursor : null;
    if (!hasNext) break;
  }

  return all;
}

export async function getCollections(): Promise<Array<{ id: string; title: string; description: string }>> {
  const query = `
    query getCollections {
      collections(first: 250) {
        nodes {
          id
          title
          description
        }
      }
    }
  `;

  const data = await storefront(query, {}, { revalidate: 60 });
  return data.collections.nodes;
}

export async function getProductByHandle(handle: string, revalidate = 60): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        metafields(identifiers: [
            { namespace: "custom", key: "plp_images" }
            { namespace: "custom", key: "material_and_finish" }
            { namespace: "custom", key: "rarity" }
            { namespace: "custom", key: "description" }
            { namespace: "custom", key: "dimensions" }
            { namespace: "custom", key: "material_and_finish_description" }
            { namespace: "custom", key: "care" }
            { namespace: "custom", key: "shipping" }
            { namespace: "custom", key: "description_long" }
            { namespace: "custom", key: "description_long_image" }
          ]) {
            namespace
            key
            type
            value
            reference {
      ... on MediaImage {
        image {
          url
          altText
          width
          height
        }
      }
    }
              references(first: 10) {
              nodes {
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
        }
        images(first: 8) { nodes { url } }
        variants(first: 1) {
          nodes {
            id
            price {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            currentlyNotInStock
          }
        }
      }
    }
  `;

  const data = await storefront(query, { handle }, { revalidate });
  const p = data.productByHandle;


  const plpMetafield = p.metafields?.find((m: any) => m?.key === "plp_images");

  const imageUrls = plpMetafield?.references?.nodes
    ?.map((node: { image: { url: any; }; }) => node.image?.url)
    .filter(Boolean) || [];


  if (!p) return null;

  return {
    id: p.id,
    variantId: p.variants?.nodes?.[0]?.id,
    title: p.title,
    handle: p.handle,
    images: (p.images?.nodes || []).map((n: any) => n.url),
    tags: [], // productByHandle query does not return tags, consider adding if needed
    collections: [], // productByHandle query does not return collections, consider adding if needed
    metafields: {
      plp_images: imageUrls,
      material_and_finish: p.metafields?.filter((m: any) => m?.key === "material_and_finish")[0]?.value,
      rarity: p.metafields?.filter((m: any) => m?.key === "rarity")[0]?.value,
      description: p.metafields?.filter((m: any) => m?.key === "description")[0]?.value,
      dimensions: p.metafields?.filter((m: any) => m?.key === "dimensions")[0]?.value,
      material_and_finish_description: p.metafields?.filter((m: any) => m?.key === "material_and_finish_description")[0]?.value,
      care: p.metafields?.filter((m: any) => m?.key === "care")[0]?.value,
      shipping: p.metafields?.filter((m: any) => m?.key === "shipping")[0]?.value,
      description_long: p.metafields?.filter((m: any) => m?.key === "description_long")[0]?.value,
      description_long_image: {
        url: p.metafields?.filter((m: any) => m?.key === "description_long_image")[0]?.reference?.image.url,
        altText: p.metafields?.filter((m: any) => m?.key === "description_long_image")[0]?.reference?.image.altText,
      },
    },
    price:
      p.variants?.nodes?.[0]?.price?.amount && p.variants?.nodes?.[0]?.price?.currencyCode
        ? `${p.variants.nodes[0].price.amount} ${p.variants.nodes[0].price.currencyCode}`
        : undefined,
    quantityAvailable: p.variants?.nodes?.[0]?.quantityAvailable,
    availableForSale: p.variants?.nodes?.[0]?.availableForSale,
    currentlyNotInStock: p.variants?.nodes?.[0]?.currentlyNotInStock,

  };
}

export type { ShopifyProduct };
