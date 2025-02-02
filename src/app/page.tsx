import { Metadata } from "next";
import { CustomImage } from "./Components/Image/Image";
import Menu from "./Components/Menu/Menu";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OF THE USELESS",
  description:
    "OF THE USELESS is an independent brand based in Stockholm, Sweden. We design, handcraft, and produce pieced for the everyday, with locally sourced materials. Unapologetically and down to the last detail.",
  icons: {
    icon: "/images/icon/favicon.ico",
    apple: "/images/icon/apple-touch-icon.png",
  },
  openGraph: {
    url: "https://oftheuseless.com",
    title: "OF THE USELESS",
    description:
      "OF THE USELESS is an independent brand based in Stockholm, Sweden. We design, handcraft, and produce pieced for the everyday, with locally sourced materials. Unapologetically and down to the last detail.",
    siteName: "OF THE USELESS",
    images: [
      {
        url: "/images/meta/hero_image.jpg",
      },
    ],
  },
};

export default function Home() {
  const images = [
    "/images/home/chair_01.jpg",
    "/images/home/chair_02.jpg",
    "/images/home/chair_03.jpg",
    "/images/home/chair_04.jpg",
  ];

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
            <Link href={"/shop/no-hard-feelings"}>
              <CustomImage
                ratio="4/5"
                src={images[0]}
                alt=""
                className="w-full"
              />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 lg:grid-cols-12 grid mt-[10px] gap-[10px] overflow-hidden">
          <div className="col-span-3 lg:col-start-1 lg:col-end-8">
            <Link href={"/shop/no-hard-feelings"}>
              <CustomImage
                ratio="2/3"
                src={images[1]}
                alt=""
                className="w-full"
              />
            </Link>
          </div>
          <div className="lg:hidden col-span-1" />
          <div className="col-start-3 col-end-5 lg:col-start-8 lg:col-end-13 translate-x-[2px] lg:translate-x-0">
            <Link href={"/shop/no-hard-feelings"}>
              <CustomImage
                ratio="4/5"
                src={images[2]}
                alt=""
                className="w-full"
              />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 lg:grid-cols-12 grid lg:mt-[10px] mt-[100px] gap-[10px] px-[10px]">
          <div className="lg:col-start-4 lg:col-end-10 col-span-4 order-2 lg:order-1">
            <Link href={"/shop/no-hard-feelings"}>
              <CustomImage
                ratio="4/5"
                src={images[3]}
                alt=""
                className="w-full"
              />
            </Link>
          </div>
          <div className="lg:col-start-10 lg:col-end-13 col-span-4 order-1 lg:order-2">
            <p className="uppercase">
              the climb was tough on his flesh and bones. and yet, he would do
              it all again. no hard feelings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
