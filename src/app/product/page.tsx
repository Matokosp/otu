"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Menu from "../Components/Menu/Menu";
import { CustomImage } from "../Components/Image/Image";
import Button from "../Components/Button/Button";
import { useGlobalContext } from "@/app/context/store";

import siteData from "../data/data.json";
import { Typing } from "../Components/Typing/Typing";

export default function Page() {
  const [activeItem, setActiveItem] = useState<null | number>(null);
  const [activeImage, setActiveImage] = useState(0);
  const imageRefs = useRef<HTMLDivElement[] | any>([]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeMobileImage, setActiveMobileImage] = useState(1);

  const { windowHeight } = useGlobalContext();

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

  // const handleSticky = () => {
  //   if (!stickyRef.current || !galleryRef.current) return;

  //   const rect = galleryRef.current.getBoundingClientRect();
  //   const windowBottom = window.visualViewport
  //     ? window.visualViewport.height
  //     : window.innerHeight;

  //   const shouldBeSticky = rect.bottom <= windowBottom - 45; // When the bottom of galleryRef is 10px above the window bottom

  //   setIsSticky(shouldBeSticky);
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", handleSticky);
  //   return () => window.removeEventListener("scroll", handleSticky);
  // }, []);

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
      <main className="relative  lg:mt-0">
        {/* LOGO */}
        <div
          className="w-[calc(100vw/12*2)] px-[10px] grid fixed z-[99] translate-y-[-50%]  lg:block"
          style={{
            top: "50svh",
            // typeof windowHeight === "number" ? windowHeight / 2 : "50svh",
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
              <div className="lg:w-[calc(100vw/12*2)] w-[100%] mt-[40px] lg:ml-0 lg:mt-0 uppercase lg:mt-[calc(50vh-90px)] lg:block">
                <div className="flex flex-col gap-y-[40px] break-words">
                  <p className="hidden lg:block">
                    No Hard feelings chair <br />
                    OILED OAK
                  </p>
                  <p className="">
                    Enquire <br />
                    <a
                      href="mailto:Enquires@oftheuseless.com"
                      className="opacity-50 pointer-events-auto"
                    >
                      <Typing text="Enquires@oftheuseless.com" />
                    </a>
                  </p>
                  <p className="ml-[calc(50vw-10px)] lg:ml-0">
                    Handcrafted in Sweden <br />
                    LOCALLY SOURCED OAK
                  </p>
                </div>
                <div className="mt-[10px] ml-[calc(50vw-10px)] lg:ml-0">
                  <ul className="[&>li>h4]:cursor-pointer">
                    {siteData.product.info.map((item, i) => {
                      return (
                        <li key={item.title} className="overflow-hidden">
                          <h4
                            className="pointer-events-auto"
                            onClick={() => handleClick(i)}
                          >
                            {item.title} {activeItem === i ? "-" : "+"}
                          </h4>
                          <span
                            className={`pl-[20px] block ${
                              activeItem === i
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
            <Button
              className="z-[999] pointer-events-auto"
              link="mailto:info@otu.com"
              text="enquire|made to order"
            />
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
                    priority
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE PAGE */}
        <div className="lg:hidden">
          <div
            ref={stickyRef}
            className={`
            top-[73px] flex z-[999] flex-col justify-between pb-[10px] px-[10px] lg:hidden`}
          >
            <div className="w-[100%] mt-[40px] uppercase">
              <div className="flex flex-col gap-y-[40px] break-words">
                <p className="ml-[calc(50vw-10px)] lg:ml-0">
                  Handcrafted in Sweden <br />
                  LOCALLY SOURCED OAK
                </p>
              </div>
              <div className="mt-[10px] ml-[calc(50vw-10px)] relative">
                <ul className="[&>li>h4]:cursor-pointer absolute">
                  {siteData.product.info.map((item, i) => {
                    return (
                      <li key={item.title} className="overflow-hidden">
                        <h4
                          className="pointer-events-auto"
                          onClick={() => handleClick(i)}
                        >
                          {item.title} {activeItem === i ? "-" : "+"}
                        </h4>
                        <span
                          className={`pl-[20px] block ${
                            activeItem === i
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
                    priority
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
            <div
              className="col-span-1 relative z-[2] flex flex-col gap-[5px] items-end"
              ref={galleryRef}
            >
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
          <Button
            className="z-[999] pointer-events-auto"
            link="mailto:info@otu.com"
            text="enquire|made to order"
          />
          <p className="px-[10px] mt-[10px] uppercase">
            <a
              href="mailto:Enquires@oftheuseless.com"
              className="opacity-50 pointer-events-auto"
            >
              <Typing text="Enquires@oftheuseless.com" />
            </a>
          </p>
        </div>

        <div className="grid lg:grid-cols-12 grid-cols-4 gap-[10px] px-[10px] mt-[31px] lg:mt-0">
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
