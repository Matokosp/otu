import "./globals.css";
import Footer from "./Components/Footer/Footer";
import { GlobalContextProvider } from "./context/store";
import ShopifyConsent from "./Components/ShopifyConsent/ShopifyConsent";
import { Metadata } from "next";
import { getServerRegion, getRegionCountry } from "./lib/market";

export const metadata: Metadata = {
  metadataBase: new URL("https://oftheuseless.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const region = await getServerRegion();
  const countryCode = getRegionCountry(region);

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ShopifyConsent
          shopDomain={process.env.SHOPIFY_STORE_DOMAIN!}
          storefrontAccessToken={process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!}
          countryCode={countryCode}
        />
        <GlobalContextProvider>
          {children}
          <Footer />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
