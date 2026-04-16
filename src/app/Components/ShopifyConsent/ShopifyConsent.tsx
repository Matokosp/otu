'use client';

import Script from 'next/script';

type Props = {
  shopDomain: string;
  storefrontAccessToken: string;
};

declare global {
  interface Window {
    Shopify?: any;
  }
}

export default function ShopifyConsent({ shopDomain, storefrontAccessToken }: Props) {
  return (
    <Script
      id="shopify-consent"
      src="https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.Shopify = window.Shopify || {};
        window.Shopify.currentShop = {
          shop: shopDomain,
          countryCode: 'SE',
          storefrontAccessToken,
        };
        console.log('✅ Shopify Consent API ready', window.Shopify.customerPrivacy);
      }}
    />
  );
}