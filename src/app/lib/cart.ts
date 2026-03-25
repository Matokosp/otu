const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2023-10";
const SHOPIFY_STOREFRONT_URL = `https://${domain}/api/${apiVersion}/graphql.json`;

const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;


async function shopifyFetch(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
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
            priceV2 {
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

export async function createCart(variantId: string, quantity: number = 1) {
  const query = `
    mutation cartCreate($input: CartInput!) {
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
    },
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartCreate;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
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
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartLinesAdd;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
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
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartLinesUpdate;
}

export async function removeCartLine(cartId: string, lineId: string) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
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
  };

  const { data } = await shopifyFetch(query, variables);
  return data.cartLinesRemove;
}

export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
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
                priceV2 {
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

  const { data } = await shopifyFetch(query, { cartId });
  return data.cart;
}
