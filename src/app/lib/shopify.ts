import { applyDevTlsBypass } from "./devTls";

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

  applyDevTlsBypass();

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

  const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";
  const url = `https://${domain}/api/${apiVersion}/graphql.json`;

  const res = await fetch(url, fetchOptions);
  if (!res.ok) throw new Error(`Shopify Storefront API request failed: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function getShopPolicies(country = "SE"): Promise<{
  privacyPolicy: { title: string; body: string } | null;
  refundPolicy: { title: string; body: string } | null;
  termsOfService: { title: string; body: string } | null;
}> {
  const query = `
    query getShopPolicies($country: CountryCode!) @inContext(country: $country) {
      shop {
        privacyPolicy { body title }
        refundPolicy { body title }
        termsOfService { body title }
      }
    }
  `;

  const data = await storefront(query, { country }, { revalidate: 3600 });

  return {
    privacyPolicy: data.shop.privacyPolicy || null,
    refundPolicy: data.shop.refundPolicy || null,
    termsOfService: data.shop.termsOfService || null,
  };
}

export async function getAllProducts(country = "SE"): Promise<ShopifyProduct[]> {
  const pageSize = 50;
  let hasNext = true;
  let after: string | null = null;
  const all: ShopifyProduct[] = [];

  const query = `
    query getProducts($first: Int!, $after: String, $country: CountryCode!) @inContext(country: $country) {
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
          collections(first: 250) { nodes { title id } }
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
    const variables: any = { first: pageSize, country };
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

export async function getCollections(country = "SE"): Promise<Array<{ id: string; title: string; description: string }>> {
  const query = `
    query getCollections($country: CountryCode!) @inContext(country: $country) {
      collections(first: 250) {
        nodes {
          id
          title
          description
        }
      }
    }
  `;

  const data = await storefront(query, { country }, { revalidate: 60 });
  return data.collections.nodes;
}

export async function getProductByHandle(handle: string, revalidate = 60, country = "SE"): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!, $country: CountryCode!) @inContext(country: $country) {
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

  const data = await storefront(query, { handle, country }, { revalidate });
  const p = data.productByHandle;

  if (!p) return null;

  const plpMetafield = p.metafields?.find((m: any) => m?.key === "plp_images");

  const imageUrls = plpMetafield?.references?.nodes
    ?.map((node: { image: { url: any; }; }) => node.image?.url)
    .filter(Boolean) || [];

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

export type BlogArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string | null;
  contentHtml: string;
  publishedAt: string;
  image: { url: string; altText: string | null } | null;
  blogHandle: string;
  blogTitle: string;
  metafields: {
    with?: string;
    craft?: string;
    location?: string;
  };
};

export async function getBlogArticles(): Promise<BlogArticle[]> {
  const query = `
    query getBlogArticles {
      blogs(first: 10) {
        nodes {
          handle
          title
          articles(first: 250, sortKey: PUBLISHED_AT, reverse: true) {
            nodes {
              id
              title
              handle
              excerpt
              contentHtml
              publishedAt
              image { url altText }
              metafields(identifiers: [
                { namespace: "custom", key: "with" }
                { namespace: "custom", key: "craft" }
                { namespace: "custom", key: "location" }
              ]) {
               namespace
              key
              type
              value
              }
            }
          }
        }
      }
    }
  `;

  const data = await storefront(query, {}, { revalidate: 60 });
  const blogs = data?.blogs?.nodes || [];

  return blogs.flatMap((blog: any) =>
    (blog.articles?.nodes || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      handle: a.handle,
      excerpt: a.excerpt || null,
      contentHtml: a.contentHtml,
      publishedAt: a.publishedAt,
      image: a.image ? { url: a.image.url, altText: a.image.altText } : null,
      blogHandle: blog.handle,
      blogTitle: blog.title,
      metafields: {
        with: a.metafields?.find((m: any) => m?.key === 'with')?.value,
        craft: a.metafields?.find((m: any) => m?.key === 'craft')?.value,
        location: a.metafields?.find((m: any) => m?.key === 'location')?.value,
      },
    }))
  );
}

export async function getBlogArticleByHandle(handle: string): Promise<BlogArticle | null> {
  const articles = await getBlogArticles();
  return articles.find((a) => a.handle === handle) || null;
}

export type { ShopifyProduct };
