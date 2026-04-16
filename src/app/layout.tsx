import "./globals.css";
import Footer from "./Components/Footer/Footer";
import { GlobalContextProvider } from "./context/store";
import ShopifyConsent from "./Components/ShopifyConsent/ShopifyConsent";
import CookieBanner from "./Components/CookieBanner/CookieBanner";

import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ShopifyConsent
          shopDomain={process.env.SHOPIFY_STORE_DOMAIN!}
          storefrontAccessToken={process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!}
        />
        <GlobalContextProvider>
          {children}
          <Footer />
        </GlobalContextProvider>
        {/* <Analytics /> */}
        <CookieBanner />
      </body>
    </html>
  );
}
