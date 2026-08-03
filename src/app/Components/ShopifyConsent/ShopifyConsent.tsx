'use client';

import Script from 'next/script';

type Props = {
  shopDomain: string;
  storefrontAccessToken: string;
  countryCode: string;
};

declare global {
  interface Window {
    Shopify?: any;
  }
}

// The site sets no non-essential cookies (no analytics, no marketing
// pixels), so there is no consent UI — see Components/Footer removal notes.
// Shopify checkout still needs an explicit consent signal, so we declare a
// conservative default (everything declined) once the API is ready.
export default function ShopifyConsent({ shopDomain, storefrontAccessToken, countryCode }: Props) {
  return (
    <Script
      id="shopify-consent"
      src="https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.Shopify = window.Shopify || {};
        window.Shopify.currentShop = {
          shop: shopDomain,
          countryCode,
          storefrontAccessToken,
        };
        window.Shopify.customerPrivacy?.setTrackingConsent(
          {
            analytics: false,
            marketing: false,
            preferences: false,
            sale_of_data: false,
          },
          () => {}
        );
      }}
    />
  );
}