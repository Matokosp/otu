import "./globals.css";
import Footer from "./Components/Footer/Footer";
import { GlobalContextProvider } from "./context/store";

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
