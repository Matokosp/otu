"use client";

import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { CustomImage } from "../Image/Image";
import { Typing } from "../Typing/Typing";

type LibraryArticle = {
  id: string;
  title: string;
  handle: string;
  blogTitle: string;
  publishedAt: string;
  image: { url: string; altText: string | null } | null;
  metafields: {
    with?: string;
    craft?: string;
    location?: string;
  };
};

export const LibraryDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [articles, setArticles] = useState<LibraryArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/library");
      const data = await res.json();
      setArticles(data?.articles ?? []);
    } catch (error) {
      console.error("Error fetching library articles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchArticles();
    }
  }, [isOpen, fetchArticles]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Library"
        tabIndex={-1}
        className={`[&_*]:text-[12px] outline-none fixed top-0 right-0 h-full z-[999] pointer-events-auto bg-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          } w-full lg:w-[50vw]`}
      >
        {/* Header: mirrors the Library/Cart nav slots it sits on top of */}
        <div className="grid grid-cols-2 gap-[10px] px-[10px] py-[10px] uppercase text-sm">
          <p>Library</p>
          <button
            onClick={onClose}
            aria-label="Close library"
            className="text-right lg:text-left uppercase text-sm"
          >
            <Typing text="close" />
          </button>
        </div>

        {/* Articles */}
        <div className="flex-1 overflow-y-auto px-[10px] pt-[20px] pb-[30px]">
          {loading ? (
            <p className="uppercase text-sm opacity-50">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="uppercase text-sm opacity-50">Nothing here yet.</p>
          ) : (
            <>
              {/* Mobile: 4-col grid, matching the site's mobile grid unit */}
              <div className="lg:hidden grid grid-cols-4 gap-x-[10px] gap-y-[10px] uppercase text-sm">
                {articles.map((article, index) => {
                  const num = String(articles.length - index).padStart(2, "0");
                  return (
                    <Fragment key={article.id}>
                      <div className="col-span-1">{num}</div>
                      <div className="col-span-2 col-start-2">
                        {article.image && (
                          <div className="aspect-[228/343] relative overflow-hidden">
                            <CustomImage
                              alt={article.image.altText || article.title}
                              src={article.image.url}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <p className="col-span-4">{article.blogTitle}</p>
                      <span className="col-span-1 opacity-50">With</span>
                      <span className="col-span-3">{article.metafields.with ?? "-"}</span>
                      <span className="col-span-1 opacity-50">Craft</span>
                      <span className="col-span-3">{article.metafields.craft ?? "-"}</span>
                      <span className="col-span-1 opacity-50">Location</span>
                      <span className="col-span-2">{article.metafields.location ?? "-"}</span>
                      <Link
                        href={`/library/${article.handle}`}
                        onClick={onClose}
                        className="col-span-1 text-right hover:opacity-50"
                      >
                        <Typing text="read" />
                      </Link>
                    </Fragment>
                  );
                })}
              </div>

              {/* Desktop: 6-col local grid, one column unit per outer page column */}
              <div className="hidden lg:grid lg:grid-cols-6 gap-x-[10px] gap-y-[10px] uppercase text-sm">
                {articles.map((article) => (
                  <Fragment key={article.id}>
                    <div className="col-span-3">
                      <div className="grid grid-cols-[100px_1fr] gap-y-[4px] max-w-[300px]">
                        <p></p>
                        <p className="mb-[2px]">{article.blogTitle}</p>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-y-[2px] max-w-[300px]">
                        <span className="opacity-50">With</span>
                        <span>{article.metafields.with ?? "-"}</span>
                        <span className="opacity-50">Craft</span>
                        <span>{article.metafields.craft ?? "-"}</span>
                        <span className="opacity-50">Location</span>
                        <span>{article.metafields.location ?? "-"}</span>
                      </div>
                      <Link
                        href={`/library/${article.handle}`}
                        onClick={onClose}
                        className="inline-block mt-[20px] pl-[100px] hover:opacity-50"
                      >
                        <Typing text="read" />
                      </Link>
                    </div>
                    <div className="col-span-2">
                      {article.image && (
                        <div className="aspect-[228/343] relative overflow-hidden">
                          <CustomImage
                            alt={article.image.altText || article.title}
                            src={article.image.url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
