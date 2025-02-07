import "./globals.css";
import Footer from "./Components/Footer/Footer";
import { GlobalContextProvider } from "./context/store";

import { Analytics } from "@vercel/analytics/next";

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
        <Analytics />
      </body>
    </html>
  );
}
