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
  const [activeMobileImage, setActiveMobileImage] = useState(1);

  const images = [
    "/images/chair1.png",
    "/images/image[2_3].png",
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
        <div className="w-[calc(100vw/12*2)] px-[10px] grid fixed z-[99] top-[50vh] translate-y-[-50%]">
          <div className="pl-[10%] min-w-[180px]">
            <Link href={"/"}>
              <CustomImage alt="" src="/images/logo.svg" className="w-full" />
            </Link>
          </div>
        </div>
        <div className="grid lg:grid-cols-12 grid-cols-4 lg:px-[10px] gap-x-[10px]">
          <div className="col-span-5 h-[calc(100vh-73px)] sticky top-[73px] flex flex-col justify-between px-[10px] lg:px-0 pb-[10px] z-[3] pointer-events-none">
            <div className="flex justify-between">
              <div className="w-[calc(100vw/12*0.45)] flex flex-col gap-y-[5px] hidden lg:block">
                {images.map((image, i) => {
                  return (
                    <button
                      className="pointer-events-auto"
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
              <div className="w-[calc(100vw/12*2)] uppercase lg:mt-[calc(50vh-90px)] hidden lg:block">
                <div className="flex flex-col gap-y-[40px]">
                  <p>
                    No Hard feelings chair <br />
                    OILED OAK
                  </p>
                  <p>
                    Enquire <br />
                    <a
                      href="mailto:Enquires@oftheuseless.com"
                      className="opacity-50"
                    >
                      Enquires@oftheuseless.com
                    </a>
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
                          <h4
                            className="pointer-events-auto"
                            onClick={() => handleClick(i)}
                          >
                            {item.title} +
                          </h4>
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
            <Button
              className="z-[999] pointer-events-auto"
              link="mailto:info@otu.com"
              text="enquire|made to order"
            />
          </div>
          <div className="col-span-5 flex flex-col gap-y-[10px] px-[10px] lg:px-0 pb-[10px] mt-[-45vh] lg:mt-[unset]">
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
                    priority
                  />
                </div>
              );
            })}
          </div>
          <div className="lg:hidden grid grid-cols-4 col-span-5 mb-[53px] gap-[10px]">
            <div className="col-span-3 relative">
              {images.map((image, i) => {
                return (
                  i !== 0 && (
                    <div
                      key={images[i]}
                      className={`w-full top-0 absolute ${
                        activeMobileImage === i && "relative z-[2]"
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
                        priority
                      />
                    </div>
                  )
                );
              })}
            </div>
            <div className="col-span-1 relative z-[2] flex flex-col gap-[5px] items-end">
              {images.map((image, i) => {
                return (
                  i !== 0 && (
                    <div
                      onClick={() => setActiveMobileImage(i)}
                      key={images[i]}
                      className={`w-[60%] top-0 cursor-pointer ${
                        activeMobileImage === i ? "opacity-100" : "opacity-50"
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
                        priority
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-12 grid-cols-4 gap-[10px] px-[10px] mt-[100px] lg:mt-0">
          <div className="lg:col-span-5 col-span-4 flex flex-col justify-between gap-y-[100px] lg:gap-y-[unset]">
            <div className="w-full flex uppercase">
              <p className="lg:w-3/5 w-2/4">No Hard feelings chair</p>
              <p>SOLID OILED OAK</p>
            </div>
            <p className="uppercase lg:w-3/5 w-full">
              A soft and romantic mint inspired by unstained affection and
              devotion. Amorist gently fuses green mint, peppermint and menthol,
              resulting in a restrained expression of a true quintessential.
            </p>
          </div>
          <div className="lg:col-span-7 col-span-4 relative uppercase flex flex-col gap-[10px]">
            <p className="lg:absolute left-0 bottom-0 origin-top-right lg:translate-x-[calc(-100%-10px)] lg:rotate-90 lg:translate-y-[14px] order-2 lg:order-1">
              (Image 1.) Bathroom in Palazzo Daniele, Italy.
            </p>
            <CustomImage
              alt=""
              src={"/images/image[5_4]4.png"}
              ratio={"5/4"}
              className="w-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
