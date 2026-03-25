"use client";

import { useState, useEffect, useCallback } from "react";
import { CustomImage } from "../Image/Image";
import { Typing } from "../Typing/Typing";

const CART_ID_KEY = "shopify_cart_id";

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      metafield?: {
        value: string;
      } | null;
    };
    image?: {
      url: string;
      altText: string;
    } | null;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
  };
};

type CartData = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: CartLine[];
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
};

const formatPrice = (amount: string, currencyCode: string) => {
  const num = parseFloat(amount);
  const symbol = currencyCode === "EUR" ? "€" : currencyCode === "USD" ? "$" : currencyCode === "GBP" ? "£" : currencyCode === "SEK" ? "kr " : "";
  return `${symbol} ${Math.round(num)}`;
};

export const Cart = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingLines, setUpdatingLines] = useState<Set<string>>(new Set());

  const fetchCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      setCart(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", cartId }),
      });
      const data = await res.json();
      if (data?.id) {
        setCart(data);
      } else {
        localStorage.removeItem(CART_ID_KEY);
        setCart(null);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const updateQuantity = async (lineId: string, newQuantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;

    setUpdatingLines((prev) => new Set(prev).add(lineId));
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          cartId,
          lineId,
          quantity: newQuantity,
        }),
      });
      const data = await res.json();
      if (data?.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  const removeLine = async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;

    setUpdatingLines((prev) => new Set(prev).add(lineId));
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", cartId, lineId }),
      });
      const data = await res.json();
      if (data?.cart) {
        setCart(data.cart);
        if (data.cart.lines.nodes.length === 0) {
          localStorage.removeItem(CART_ID_KEY);
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  const lines = cart?.lines?.nodes ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;

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
        className={`[&_*]:text-[12px] fixed top-0 right-0 h-full z-[999] pointer-events-auto bg-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          } w-full lg:w-[50vw]`}
      >
        {/* Header */}
        <div className="grid grid-cols-6 gap-[10px] px-[10px] py-[10px] uppercase text-sm">
          <div className="col-span-3"></div>
          <p className="col-span-2">Cart [{totalQuantity}]</p>
          <button onClick={onClose} className="col-span-1 text-right uppercase text-sm">
            <Typing text="close" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-[10px] pt-[30px]">
          {loading ? (
            <p className="uppercase text-sm opacity-50">Loading...</p>
          ) : lines.length === 0 ? (
            <p className="uppercase text-sm opacity-50">Your cart is empty</p>
          ) : (
            <div className="flex flex-col gap-y-[40px] lg:gap-y-[10px]">
              {lines.map((line, index) => {
                const isUpdating = updatingLines.has(line.id);
                const itemPrice = parseFloat(line.merchandise.priceV2.amount) * line.quantity;
                const finish = line.merchandise.product.metafield?.value ?? "-";

                return (
                  <div
                    key={line.id}
                    className={`uppercase text-sm ${isUpdating ? "opacity-50" : ""}`}
                  >
                    {/* Mobile layout */}
                    <div className="lg:hidden grid grid-cols-4 gap-x-[10px]">
                      {/* Row 1: Index in col 1, Image in cols 2-5 */}
                      <div className="col-span-1">
                        <p>{String(index + 1).padStart(2, "0")}</p>
                      </div>
                      <div className="col-span-2">
                        {line.merchandise.image?.url && (
                          <CustomImage
                            src={line.merchandise.image.url}
                            alt={line.merchandise.image.altText ?? ""}
                            ratio="2/3"
                            className="w-full"
                          />
                        )}
                      </div>
                      <div className="col-span-1" />

                      {/* Row 2: Labels col 1-2, Values col 3-6 */}
                      <div className="col-span-1 flex flex-col gap-y-[2px] opacity-50 mt-[10px]">
                        <p>Item</p>
                        <p>Finish</p>
                      </div>
                      <div className="col-span-3 flex flex-col gap-y-[2px] mt-[10px]">
                        <p>{line.merchandise.product.title}</p>
                        <p>{finish}</p>
                      </div>

                      {/* Row 3: Qty/Subtotal labels, values, remove */}
                      <div className="col-span-1 flex flex-col gap-y-[2px] opacity-50 mt-[10px]">
                        <p>Qty</p>
                        <p>Subtotal</p>
                      </div>
                      <div className="col-span-2 flex flex-col gap-y-[2px] mt-[10px]">
                        <div className="flex items-center gap-x-[10px]">
                          <button
                            onClick={() =>
                              updateQuantity(line.id, Math.max(1, line.quantity - 1))
                            }
                            disabled={isUpdating || line.quantity <= 1}
                            className="opacity-50 hover:opacity-100"
                          >
                            -
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(line.id, line.quantity + 1)
                            }
                            disabled={isUpdating}
                            className="opacity-50 hover:opacity-100"
                          >
                            +
                          </button>
                        </div>
                        <p>
                          {formatPrice(
                            String(itemPrice),
                            line.merchandise.priceV2.currencyCode
                          )}
                        </p>
                      </div>
                      <div className="col-span-1 flex flex-col justify-end items-end mt-[10px]">
                        <button
                          onClick={() => removeLine(line.id)}
                          disabled={isUpdating}
                          className="hover:opacity-50"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>

                    {/* Desktop layout - 6 column grid */}
                    <div className="hidden lg:grid lg:grid-cols-6 gap-[10px]">
                      {/* Col 1: Index */}
                      <div className="col-span-1">
                        <p>{String(index + 1).padStart(2, "0")}</p>
                      </div>

                      {/* Col 2: Image */}
                      <div className="col-span-1">
                        {line.merchandise.image?.url ? (
                          <CustomImage
                            src={line.merchandise.image.url}
                            alt={line.merchandise.image.altText ?? ""}
                            ratio="2/3"
                            className="w-full"
                          />
                        ) : (
                          <div />
                        )}
                      </div>

                      {/* Col 3: Labels */}
                      <div className="col-span-1 flex flex-col gap-y-[5px] opacity-50">
                        <p>Item</p>
                        <p>Finish</p>
                        <p className="mt-[40px]">Qty</p>
                        <p>Subtotal</p>
                      </div>

                      {/* Col 4: Values */}
                      <div className="col-span-1 flex flex-col gap-y-[5px]">
                        <p>{line.merchandise.product.title}</p>
                        <p>{finish}</p>
                        <div className="flex items-center gap-x-[10px] mt-[40px]">
                          <button
                            onClick={() =>
                              updateQuantity(line.id, Math.max(1, line.quantity - 1))
                            }
                            disabled={isUpdating || line.quantity <= 1}
                            className="opacity-50 hover:opacity-100"
                          >
                            -
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(line.id, line.quantity + 1)
                            }
                            disabled={isUpdating}
                            className="opacity-50 hover:opacity-100"
                          >
                            +
                          </button>
                        </div>
                        <p>
                          {formatPrice(
                            String(itemPrice),
                            line.merchandise.priceV2.currencyCode
                          )}
                        </p>
                      </div>

                      {/* Col 5: Empty */}
                      <div className="col-span-1" />

                      {/* Col 6: Remove */}
                      <div className="col-span-1 flex flex-col justify-start items-end pt-[115px]">
                        <button
                          onClick={() => removeLine(line.id)}
                          disabled={isUpdating}
                          className="cursor-pointer"
                        >
                          <Typing text="REMOVE" />

                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div>
            <div className="grid grid-cols-6 gap-[10px] px-[10px] uppercase text-sm py-[20px]">
              {/* Empty cols 1-2 on desktop */}
              <div className="hidden lg:block lg:col-span-2" />

              {/* Labels */}
              <div className="col-span-2 lg:col-span-1 flex flex-col gap-y-[2px] opacity-50">
                <p>Shipping</p>
                <p>Total (incl. VAT)</p>
              </div>

              {/* Values */}
              <div className="col-span-4 lg:col-span-3 flex flex-col gap-y-[2px]">
                <p>Calculated in the next step</p>
                <p>
                  {formatPrice(
                    cart?.cost?.totalAmount?.amount ?? "0",
                    cart?.cost?.totalAmount?.currencyCode ?? "EUR"
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white text-center uppercase text-sm h-[34px] hover:opacity-90 transition-opacity"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
