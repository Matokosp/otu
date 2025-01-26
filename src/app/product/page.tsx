"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Menu from "../Components/Menu/Menu";
import { CustomImage } from "../Components/Image/Image";
import Button from "../Components/Button/Button";

import siteData from "../data/data.json";

export default function Page() {
  const [activeItem, setActiveItem] = useState<null | number>(null);
  const [activeImage, setActiveImage] = useState(0);
  const imageRefs = useRef<HTMLDivElement[] | any>([]);

  const images = [
    "/images/chair1.png",
    "/images/chair2.png",
    "/images/chair3.png",
  ];

  const handleClick = (i: number) => {
    setActiveItem(activeItem === i ? null : i);
  };

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

  return (
    <div className="relative">
      <Menu product />
      <main className="relative mt-[calc(-100vh+73px)]">
        <div className="w-[calc(100vw/12*2)] px-[10px] grid fixed top-[50vh] translate-y-[-50%] z-[999]">
          <div className="pl-[10%]">
            <Link href={"/"}>
              <CustomImage alt="" src="/images/logo.svg" className="w-full" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-12 px-[10px] gap-x-[10px]">
          <div className="col-span-5 h-[calc(100vh-73px)] sticky top-[73px] flex flex-col justify-between pb-[10px]">
            <div className="flex justify-between">
              <div className="w-[calc(100vw/12*0.45)] flex flex-col gap-y-[5px]">
                {images.map((image, i) => {
                  return (
                    <button
                      onClick={() => handleImageButtonClick(i)}
                      key={images[i]}
                    >
                      <CustomImage
                        src={images[i]}
                        ratio="2/3"
                        alt=""
                        className={`w-full ${
                          activeImage === i ? "opacity-100" : "opacity-50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="w-[calc(100vw/12*2)] uppercase mt-[calc(50vh-90px)]">
                <div className="flex flex-col gap-y-[40px]">
                  <p>
                    No Hard feelings chair <br />
                    OILED OAK
                  </p>
                  <p>
                    € 1900 <br />
                    <span className="opacity-50">Including VAT</span>
                  </p>
                  <p>
                    Handcrafted in Sweden <br />
                    LOCALLY SOURCED OAK
                  </p>
                </div>
                <div className="mt-[10px]">
                  <ul className="[&>li>h4]:cursor-pointer">
                    {siteData.product.info.map((item, i) => {
                      return (
                        <li key={item.title} className="overflow-hidden">
                          <h4 onClick={() => handleClick(i)}>{item.title} +</h4>
                          <p
                            className={`${
                              activeItem === i ? "h-auto mb-[10px]" : "h-0"
                            }`}
                          >
                            {item.text}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <Button link="mailto:info@otu.com" text="buy|made to order" />
          </div>
          <div className="col-span-5 flex flex-col gap-y-[10px] pb-[10px]">
            {images.map((image, i) => {
              return (
                <div
                  ref={(el: any) => (imageRefs.current[i] = el!)}
                  key={images[i]}
                  className="w-full"
                  style={{
                    scrollMarginTop: "73px",
                  }}
                >
                  <CustomImage
                    src={images[i]}
                    ratio="2/3"
                    alt=""
                    className={`w-full ${
                      ""
                      //   activeImage === i ? "opacity-100" : "opacity-50"
                    }`}
                    key={images[i]}
                    priority
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-[10px] px-[10px]">
          <div className="col-span-5 flex flex-col justify-between">
            <div className="w-full flex uppercase">
              <p className="w-3/5">No Hard feelings chair</p>
              <p>SOLID OILED OAK</p>
            </div>
            <p className="uppercase w-3/5">
              A soft and romantic mint inspired by unstained affection and
              devotion. Amorist gently fuses green mint, peppermint and menthol,
              resulting in a restrained expression of a true quintessential.
            </p>
          </div>
          <div className="col-span-7 relative uppercase">
            <p className="absolute left-0 bottom-0 origin-top-right translate-x-[calc(-100%-10px)] rotate-90 translate-y-[14px]">
              (Image 1.) Bathroom in Palazzo Daniele, Italy.
            </p>
            <CustomImage
              alt=""
              src={"/images/image[5_4]4.png"}
              ratio="5/4"
              className="w-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
