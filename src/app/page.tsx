"use client";

import { CustomImage } from "./Components/Image/Image";
import Menu from "./Components/Menu/Menu";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <Menu />
      <main className="relative mt-[-100svh] lg:pt-[73px] pb-[33px] pt-[calc(50svh+65px)]">
        <div className="w-[calc(100vw/12*2)] px-[10px] grid fixed top-[50svh] translate-y-[-50%]">
          <div className="pl-[10%] min-w-[180px]">
            <Link href={"/"}>
              <CustomImage alt="" src="/images/logo.svg" className="w-full" />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 lg:grid-cols-12 grid px-[10px] gap-x-[10px]">
          <div className="col-span-4 lg:col-start-4 lg:col-end-10">
            <Link href={"/product"}>
              <CustomImage
                ratio="4/5"
                src="/images/heroImage[4_5].png"
                alt=""
                className="w-full"
                priority
              />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 lg:grid-cols-12 grid mt-[10px] gap-[10px]">
          <div className="col-span-3 lg:col-start-1 lg:col-end-8">
            <Link href={"/product"}>
              <CustomImage
                ratio="2/3"
                src="/images/image[2_3].png"
                alt=""
                className="w-full"
              />
            </Link>
          </div>
          <div className="lg:hidden col-span-1" />
          <div className="col-start-3 col-end-5 lg:col-start-8 lg:col-end-13">
            <Link href={"/product"}>
              <CustomImage
                ratio="4/5"
                src="/images/image[4_5].png"
                alt=""
                className="w-full"
              />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 lg:grid-cols-12 grid lg:mt-[10px] mt-[100px] gap-[10px] px-[10px]">
          <div className="lg:col-start-4 lg:col-end-10 col-span-4 order-2 lg:order-1">
            <Link href={"/product"}>
              <CustomImage
                ratio="4/5"
                src="/images/image[4_5]3.png"
                alt=""
                className="w-full"
              />
            </Link>
          </div>
          <div className="lg:col-start-10 lg:col-end-13 col-span-4 order-1 lg:order-2">
            <p className="uppercase">
              Like a door opened to winter, fresh ice, burning light, crackling
              snow, and a warm cooking stove.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
