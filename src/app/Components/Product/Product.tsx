"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Menu from "../../Components/Menu/Menu";
import { CustomImage } from "../../Components/Image/Image";
import Button from "../../Components/Button/Button";
import { useGlobalContext } from "@/app/context/store";
import { Typing } from "../../Components/Typing/Typing";
import { formatPrice } from "@/app/lib/formatPrice";

const CART_ID_KEY = "shopify_cart_id";

type ProductData = {
  title?: string;
  price?: string;
  images?: string[];
  thumbnailImages?: string[];
  variantId?: string | null;
  metafields: {
    plp_images?: string[];
    material_and_finish?: string;
    rarity?: string;
    description?: string;
    dimensions?: string;
    material_and_finish_description?: string;
    care?: string;
    shipping?: string;
    description_long?: string;
    description_long_image?: { url: string; altText: string };
  } | null;
  productAvailable?: boolean | null;
  quantityAvailable?: number | null;
  availableForSale?: boolean | null;
};

export const Product = ({ productData, isInternational }: { productData?: ProductData; isInternational?: boolean }) => {
  const vatLabel = isInternational ? "Excluding VAT — import duties may apply" : "Including VAT";

  const [activeItem, setActiveItem] = useState<null | number>(null);
  const [activeImage, setActiveImage] = useState(0);
  const imageRefs = useRef<HTMLDivElement[] | any>([]);
  const [activeMobileImage, setActiveMobileImage] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { windowHeight, refreshCartCount } = useGlobalContext();

  const images = productData?.images && productData.images.length > 0 ? productData.images : [];
  const thumbnailImages = productData?.images && productData.images.length > 0 ? productData.images : [];

  const isMadeToOrder = productData?.quantityAvailable === 0 && productData?.availableForSale === true;
  const soldOut = productData?.availableForSale === false;
  const variantId = productData?.variantId ?? "";

  const getButtonText = () => {
    if (isAddingToCart) return "adding...|adding...";
    if (addedToCart) return "added|added to cart";
    if (soldOut) return "out of stock|out of stock";
    if (isMadeToOrder) return "enquire|made to order";
    return "in stock|add to cart";
  };

  const handleAddToCart = async () => {
    if (isMadeToOrder || soldOut || isAddingToCart || !variantId) return;

    setIsAddingToCart(true);
    try {
      const existingCartId = localStorage.getItem(CART_ID_KEY);

      if (existingCartId) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", cartId: existingCartId, variantId, quantity: 1 }),
        });
        const result = await res.json();

        if (result.userErrors?.length > 0) {
          const res2 = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "create", variantId, quantity: 1 }),
          });
          const newResult = await res2.json();
          if (newResult.cart?.id) {
            localStorage.setItem(CART_ID_KEY, newResult.cart.id);
          }
        }
      } else {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", variantId, quantity: 1 }),
        });
        const result = await res.json();
        if (result.cart?.id) {
          localStorage.setItem(CART_ID_KEY, result.cart.id);
        }
      }

      setAddedToCart(true);
      refreshCartCount();
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleClick = (i: number) => {
    setActiveItem(activeItem === i ? null : i);
  };

  const productInfo = [
    {
      "title": "Dimensions",
      "text": productData?.metafields?.dimensions ? `<p>${productData.metafields.dimensions}</p>` : ""
    },
    {
      "title": "Material and Finish",
      "text": productData?.metafields?.material_and_finish_description ? `<p>${productData.metafields.material_and_finish_description}</p>` : ""
    },
    {
      "title": "Care",
      "text": productData?.metafields?.care ? `<p>${productData.metafields.care}</p>` : ""
    },
    {
      "title": "Shipping",
      "text": productData?.metafields?.shipping ? `<p>${productData.metafields.shipping}</p>` : ""
    }
  ];

  const handleImageButtonClick = (i: number) => {
    setActiveImage(i);

    if (imageRefs.current[i]) {
      imageRefs.current[i].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          const index = imageRefs.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (index !== -1) {
            setActiveImage(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    imageRefs.current.forEach((ref: any) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      imageRefs.current.forEach((ref: any) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const renderButton = () => {

    if (soldOut) {
      return (
        <Button
          className="z-[999] pointer-events-auto opacity-50"
          disabled
          text="out of stock|out of stock"
        />
      );
    }

    if (isMadeToOrder) {
      return (
        <Button
          className="z-[999] pointer-events-auto"
          link="mailto:enquires@oftheuseless.com"
          text="enquire|made to order"
        />
      );
    }

    return (
      <Button
        className="z-[999] pointer-events-auto"
        text={getButtonText()}
        onClick={() => handleAddToCart()}
        disabled={isAddingToCart}
      />
    );
  };

  return (
    <>
      <Menu product />
      <main className="relative lg:mt-0">
        {/* LOGO */}
        <div
          className="w-[calc(100vw/12*2)] px-[10px] grid fixed z-[99] translate-y-[-50%]  lg:block"
          style={{
            top: "50svh",
          }}
        >
          <div className="pl-[10%] min-w-[180px]">
            <Link href={"/"}>
              <CustomImage alt="" src="/images/logo.svg" className="w-full" />
            </Link>
          </div>
        </div>

        {/* DESKTOP PAGE */}
        <div className="hidden lg:grid lg:grid-cols-12 grid-cols-4 lg:px-[10px] gap-x-[10px]">
          <div
            className="col-span-5 lg:sticky top-[73px] flex flex-col justify-between px-[10px] lg:px-0 pb-[10px] z-[3] pointer-events-none"
            style={{
              height: "calc(100svh - 73px)",
            }}
          >
            <div className="flex justify-between">
              <div className="w-[50px] flex flex-col gap-y-[5px] hidden lg:block">
                {thumbnailImages.map((image, i) => {
                  return (
                    <button
                      className="pointer-events-auto"
                      onClick={() => handleImageButtonClick(i)}
                      key={image}
                    >
                      <CustomImage
                        src={images[i]}
                        ratio="2/3"
                        alt=""
                        className={`w-full ${activeImage === i ? "opacity-100" : "opacity-50"
                          }`}
                          quality={80}
                      />
                    </button>
                  );
                })}
              </div>
              <div
                className="lg:w-[calc(100vw/12*2)] w-[100%] mt-[40px] lg:ml-0 lg:mt-0 uppercase lg:mt-[calc(50vh-90px)] lg:block"
                style={{ WebkitUserSelect: "none" }}
              >
                <div className="flex flex-col gap-y-[40px] break-words">
                  <p className="hidden lg:block">
                    {productData?.title ?? "No Hard feelings chair"} <br />
                    {productData?.metafields?.material_and_finish ? productData.metafields.material_and_finish : ""} <br />
                    {productData?.metafields?.rarity ? <span className="text-[rgba(0,0,0,0.5)]">{productData.metafields.rarity}</span> : ""}
                  </p>
                  <div>
                    <p>{productData?.price ? formatPrice(productData.price) : ""}</p>
                    <p className={`opacity-50`}>{vatLabel}</p>
                    <p
                      className="!select-all opacity-50 pointer-events-auto"
                      style={{ WebkitUserSelect: "all" }}
                    >
                      Enquires@oftheuseless.com
                    </p>
                  </div>
                  <p className="ml-[calc(50vw-10px)] lg:ml-0">
                    {productData?.metafields?.description ? productData.metafields.description : ""}
                  </p>
                </div>
                <div className="mt-[10px] ml-[calc(50vw-10px)] lg:ml-0">
                  <ul className="[&>li>h4]:cursor-pointer">
                    {productInfo.map((item, i) => {
                      return (
                        <li key={item.title} className="overflow-hidden">
                          <h4
                            className="pointer-events-auto"
                            onClick={() => handleClick(i)}
                          >
                            {item.title} {activeItem === i ? "-" : "+"}
                          </h4>
                          <span
                            className={`pl-[20px] block ${activeItem === i
                              ? "h-auto mb-[15px] mt-[5px]"
                              : "h-0"
                              }`}
                            dangerouslySetInnerHTML={{ __html: item.text }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            {renderButton()}
          </div>
          <div
            className="col-span-5 flex flex-col gap-y-[10px] px-[10px] lg:px-0 pb-[10px] lg:!mt-[0px]"
            style={{
              marginTop:
                typeof windowHeight === "number"
                  ? -(windowHeight / 2 - 64)
                  : "calc(-50svh - 64px)",
            }}
          >
            {images.map((image, i) => {
              return (
                <div
                  ref={(el: any) => (imageRefs.current[i] = el!)}
                  key={images[i]}
                  className={`w-full ${i !== 0 ? "hidden lg:block" : ""}`}
                  style={{
                    scrollMarginTop: "73px",
                  }}
                >
                  <CustomImage
                    src={images[i]}
                    ratio="2/3"
                    alt=""
                    className={`w-full`}
                    key={images[i]}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE PAGE */}
        <div className="lg:hidden">
          <div
            className={`top-[73px] flex z-[999] flex-col justify-between pb-[10px] px-[10px] lg:hidden`}
          >
            <div className="w-[100%] mt-[40px] uppercase">
              <div className="flex flex-col gap-y-[40px] break-words ml-[calc(50vw-10px)] lg:ml-0">
                <div>
                  <p>{productData?.price ? formatPrice(productData.price) : ""}</p>
                  <p className={`opacity-50`}>Including VAT</p>
                </div>
                <p className="">
                  {productData?.metafields?.description ? productData.metafields.description : ""}
                </p>
              </div>
              <div className="mt-[10px] ml-[calc(50vw-10px)] relative">
                <ul className="[&>li>h4]:cursor-pointer absolute flex flex-col gap-y-[5px]">
                  {productInfo.map((item, i) => {
                    return (
                      <li key={item.title} className="overflow-hidden">
                        <h4
                          className="pointer-events-auto"
                          onClick={() => handleClick(i)}
                        >
                          {item.title} {activeItem === i ? "-" : "+"}
                        </h4>
                        <span
                          className={`pl-[20px] block ${activeItem === i
                            ? "h-auto mb-[15px] mt-[5px]"
                            : "h-0"
                            }`}
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`col-span-5 flex flex-col gap-y-[10px] px-[10px] pb-[10px] mt-[calc(50svh-81px)]`}
          >
            {images.map((image, i) => {
              return (
                <div
                  key={images[i]}
                  className={`w-full ${i !== 0 ? "hidden lg:block" : ""}`}
                  style={{
                    scrollMarginTop: "73px",
                  }}
                >
                  <CustomImage
                    src={images[i]}
                    ratio="2/3"
                    alt=""
                    className={`w-full`}
                    key={images[i]}
                  />
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 col-span-5 mb-[10px] gap-[10px]">
            <div className="col-span-3 relative">
              {images.map((image, i) => {
                return (
                  i !== 0 && (
                    <div
                      key={images[i]}
                      className={`w-full top-0 absolute ${activeMobileImage === i && "relative z-[2]"
                        }`}
                      style={{
                        scrollMarginTop: "73px",
                      }}
                    >
                      <CustomImage
                        src={images[i]}
                        ratio="2/3"
                        alt=""
                        className={`w-full`}
                        key={images[i]}
                      />
                    </div>
                  )
                );
              })}
            </div>
            <div className="col-span-1 relative z-[2] flex flex-col gap-[5px] items-end">
              {thumbnailImages.map((image, i) => {
                return (
                  i !== 0 && (
                    <div
                      onClick={() => setActiveMobileImage(i)}
                      key={image}
                      className={`w-[50px] top-0 cursor-pointer ${activeMobileImage === i ? "opacity-100" : "opacity-50"
                        }`}
                      style={{
                        scrollMarginTop: "73px",
                      }}
                    >
                      <CustomImage
                        src={images[i]}
                        ratio="2/3"
                        alt=""
                        className={`w-full`}
                        key={images[i]}
                        quality={50}
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
          {renderButton()}
          <p className="px-[10px] mt-[10px] uppercase">
            <a
              href="mailto:Enquires@oftheuseless.com"
              className="opacity-50 pointer-events-auto"
            >
              <Typing text="Enquires@oftheuseless.com" />
            </a>
          </p>
        </div>

        {productData?.metafields?.description_long &&
          <div className="grid lg:grid-cols-12 grid-cols-4 gap-[10px] px-[10px] mt-[31px] lg:mt-0">
            <div className="lg:col-span-5 col-span-4 flex flex-col justify-between gap-y-[100px] lg:gap-y-[unset]">
              <div className="w-full flex uppercase">
                <p className="lg:w-3/5 w-2/4">{productData?.title ?? ""}</p>
                <p>{productData?.metafields.material_and_finish}</p>
              </div>
              <p className="uppercase lg:w-3/5 w-full" dangerouslySetInnerHTML={{ __html: productData?.metafields?.description_long ?? "" }} />
            </div>
            <div className="lg:col-span-7 col-span-4 relative uppercase flex flex-col gap-[10px]">
              <p className="lg:absolute left-0 bottom-0 origin-top-right lg:translate-x-[calc(-100%-10px)] lg:rotate-90 lg:translate-y-[14px] order-2 lg:order-1">
                {productData?.metafields?.description_long_image?.altText}
              </p>
              <CustomImage
                alt=""
                src={productData?.metafields?.description_long_image?.url ? productData.metafields.description_long_image?.url : "/images/placeholder.png"}
                ratio={"5/4"}
                className="w-full hidden lg:block"
              />
              <CustomImage
                alt=""
                src={productData?.metafields?.description_long_image?.url ? productData.metafields.description_long_image?.url : "/images/placeholder.png"}
                ratio={"2/3"}
                className="w-full lg:hidden"
              />
            </div>
          </div>
        }
      </main>
    </>
  );
};
