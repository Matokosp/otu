"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

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
  windowHeight: number;
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
});

export const GlobalContextProvider = ({ children }: any) => {
  const [background, setBackground] = useState("white");
  const [sectionInView, setSectionInView] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCustomCursor, setIsCustomCursor] = useState<string | null>(null);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };

    const onResize = () => {
      const availableHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      setWindowHeight(availableHeight);
    };

    onResize();

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
  }, []);

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
