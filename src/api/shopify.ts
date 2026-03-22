type ShopifyProduct = {
  id: string;
  title: string;
  handle?: string;
  images: string[];
  price?: string;
};

async function storefront(query: string, variables?: Record<string, any>, options?: { revalidate?: number }) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN env vars");
  }

  // Dev helper: optionally skip TLS verification when running behind a proxy
  if (process.env.SKIP_TLS_VERIFY === "true") {
    // eslint-disable-next-line no-console
    console.warn("SKIP_TLS_VERIFY=true — disabling TLS certificate verification for outgoing requests (dev only)");
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

  const status = res.status;
  const statusText = res.statusText;

  let text: string;
  try {
    text = await res.text();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Shopify storefront: failed to read response text", { url, status, statusText, err: String(e) });
    throw e;
  }

  let json: any;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Shopify storefront: failed to parse JSON response", { url, status, statusText, text: text.slice(0, 200), err: String(e) });
    throw new Error("Invalid JSON from Shopify storefront");
  }

  // Debug logging when response is unexpected
  try {
    const productsEmpty = json && json.data && json.data.products && Array.isArray(json.data.products.nodes) && json.data.products.nodes.length === 0;
    const noData = !json || (!json.data && !json.errors);
    if (status >= 400 || productsEmpty || noData) {
      // eslint-disable-next-line no-console
      console.debug("Shopify storefront debug", {
        url,
        status,
        statusText,
        querySnippet: String(query).slice(0, 200),
        variables: variables ? Object.keys(variables) : undefined,
        jsonPreview: json && typeof json === 'object' ? JSON.stringify(Object.keys(json)).slice(0, 200) : String(json).slice(0, 200),
        data: json && json.data ? json.data : undefined,
        errors: json && json.errors ? json.errors : undefined,
        textSnippet: text ? text.slice(0, 200) : undefined,
      });
    }
  } catch (e) {
    // ignore logging errors
  }

  if (json && json.errors) throw new Error(JSON.stringify(json.errors));
  return json?.data;
}

export async function getProducts(first = 8): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          images(first: 4) { nodes { url } }
          variants(first: 1) { nodes { priceV2 { amount currencyCode } } }
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
    price:
      p.variants?.nodes?.[0]?.priceV2?.amount && p.variants?.nodes?.[0]?.priceV2?.currencyCode
        ? `${p.variants.nodes[0].priceV2.amount} ${p.variants.nodes[0].priceV2.currencyCode}`
        : undefined,
  }));
}

export async function getProductByHandle(handle: string, revalidate = 60): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        images(first: 8) { nodes { url } }
        variants(first: 1) { nodes { priceV2 { amount currencyCode } } }
      }
    }
  `;

  const data = await storefront(query, { handle }, { revalidate });
  const p = data.productByHandle;
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    images: (p.images?.nodes || []).map((n: any) => n.url),
    price:
      p.variants?.nodes?.[0]?.priceV2?.amount && p.variants?.nodes?.[0]?.priceV2?.currencyCode
        ? `${p.variants.nodes[0].priceV2.amount} ${p.variants.nodes[0].priceV2.currencyCode}`
        : undefined,
  };
}

export type { ShopifyProduct };
