import type { Metadata } from "next";
import "./globals.css";
import Footer from "./Components/Footer/Footer";
import { GlobalContextProvider } from "./context/store";

export const metadata: Metadata = {
  title: "Of the Useless",
  description:
    "the climb was tough on his flesh and bones. and yet, he would do it all again. no hard feelings.",
  icons: {
    icon: "/images/icon/favicon.ico",
    apple: "/images/icon/apple-touch-icon.png",
  },
  openGraph: {
    url: "https://oftheuseless.com",
    title: "Of the Useless",
    description:
      "the climb was tough on his flesh and bones. and yet, he would do it all again. no hard feelings.",
    siteName: "Of the Useless",
    images: [
      {
        url: "/images/meta/hero_image.jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <GlobalContextProvider>
          {children}
          <Footer />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
