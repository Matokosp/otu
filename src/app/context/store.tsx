"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from "react";

const CART_ID_KEY = "shopify_cart_id";

interface ContextProps {
  background: string;
  setBackground: Dispatch<SetStateAction<string>>;
  sectionInView: string | number;
  setSectionInView: Dispatch<SetStateAction<number>>;
  mousePosition: {
    x: number;
    y: number;
  };
  isCustomCursor: string | null;
  setIsCustomCursor: Dispatch<SetStateAction<string | null>>;
  windowHeight: number | string;
  isFilteredShop: string | null;
  setIsFilteredShop: Dispatch<SetStateAction<string | null>>;
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const GlobalContext = createContext<ContextProps>({
  background: "default",
  setBackground: (): string => "",
  sectionInView: "",
  setSectionInView: (): string => "",
  mousePosition: { x: 0, y: 0 },
  isCustomCursor: null,
  setIsCustomCursor: (): void => {},
  windowHeight: 0,
  isFilteredShop: null,
  setIsFilteredShop: (): void => {},
  cartCount: 0,
  refreshCartCount: async () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [background, setBackground] = useState("white");
  const [sectionInView, setSectionInView] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCustomCursor, setIsCustomCursor] = useState<string | null>(null);
  const [windowHeight, setWindowHeight] = useState<string | number>("100svh");
  const [isFilteredShop, setIsFilteredShop] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    if (typeof window === "undefined") return;
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", cartId }),
      });
      const data = await res.json();
      setCartCount(data?.totalQuantity ?? 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };

    const removeHashOnLoad = () => {
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname);
      }
      if (window) {
        window.scrollTo(0, 0);
      }
    };

    if (typeof window !== "undefined") {
      setWindowHeight(
        window.visualViewport ? window.visualViewport.height : "100svh"
      );
    }

    const onResize = () => {
      const availableHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      setWindowHeight(availableHeight);
    };

    onResize();
    removeHashOnLoad();
    refreshCartCount();

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onResize);
      }
    };
  }, [refreshCartCount]);

  return (
    <GlobalContext.Provider
      value={{
        background,
        setBackground,
        sectionInView,
        setSectionInView,
        mousePosition,
        isCustomCursor,
        setIsCustomCursor,
        windowHeight,
        isFilteredShop,
        setIsFilteredShop,
        cartCount,
        refreshCartCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
