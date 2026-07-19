import { applyDevTlsBypass } from "./devTls";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";
const SHOPIFY_STOREFRONT_URL = `https://${domain}/api/${apiVersion}/graphql.json`;

const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;


async function shopifyFetch(query: string, variables: Record<string, any> = {}) {
  applyDevTlsBypass();

  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API request failed: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json;
}

const CART_FRAGMENT = `
  cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              title
              metafield(namespace: "custom", key: "material_and_finish") {
                value
              }
            }
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`;

export async function createCart(variantId: string, quantity: number = 1, country: string = "SE") {
  const query = `
    mutation cartCreate($input: CartInput!, $country: CountryCode!) @inContext(country: $country) {
      cartCreate(input: $input) {
        ${CART_FRAGMENT}
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: [{ merchandiseId: variantId, quantity }],
      buyerIdentity: { countryCode: country },
    },
    country,
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartCreate;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1, country: string = "SE") {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode!) @inContext(country: $country) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        ${CART_FRAGMENT}
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
    country,
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartLinesAdd;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number, country: string = "SE") {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode!) @inContext(country: $country) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        ${CART_FRAGMENT}
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [{ id: lineId, quantity }],
    country,
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartLinesUpdate;
}

export async function removeCartLine(cartId: string, lineId: string, country: string = "SE") {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode!) @inContext(country: $country) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        ${CART_FRAGMENT}
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId],
    country,
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartLinesRemove;
}

// Reconciles a persisted cart's buyerIdentity with the visitor's current
// market region, so checkout always charges the currency shown on-site
// (e.g. a cart created while in the Sweden region, then reopened after the
// visitor switches to Europe).
export async function updateCartBuyerIdentity(cartId: string, country: string) {
  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart { id }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    buyerIdentity: { countryCode: country },
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartBuyerIdentityUpdate;
}

export async function getCart(cartId: string, country: string = "SE") {
  const query = `
    query getCart($cartId: ID!, $country: CountryCode!) @inContext(country: $country) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  metafield(namespace: "custom", key: "material_and_finish") {
                    value
                  }
                }
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch(query, { cartId, country });
  return data.cart;
}
