import { CustomImage } from "./Components/Image/Image";
import Menu from "./Components/Menu/Menu";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <Menu />
      <main className="relative mt-[-100vh] pt-[73px] pb-[33px]">
        <div className="w-[calc(100vw/12*2)] px-[10px] grid fixed top-[50vh] translate-y-[-50%]">
          <div className="pl-[10%]">
            <Link href={"/"}>
              <CustomImage alt="" src="/images/logo.svg" className="w-full" />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 xl:grid-cols-12 grid px-[10px] gap-x-[10px]">
          <div className="col-start-4 col-end-10">
            <Link href={"/product"}>
              <CustomImage
                ratio="4/5"
                src="/images/heroImage[4_5].png"
                alt=""
                className="w-full"
              />
            </Link>
          </div>
        </div>
        <div className="grid-cols-4 xl:grid-cols-12 grid mt-[10px] gap-x-[10px]">
          <div className="col-start-1 col-end-8">
            <Link href={"/product"}>
              <CustomImage
                ratio="2/3"
                src="/images/image[2_3].png"
                alt=""
                className="w-full"
              />
            </Link>
          </div>
          <div className="col-start-8 col-end-13">
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
        <div className="grid-cols-4 xl:grid-cols-12 grid mt-[10px] gap-x-[10px] px-[10px]">
          <div className="col-start-4 col-end-10">
            <Link href={"/product"}>
              <CustomImage
                ratio="4/5"
                src="/images/image[4_5]3.png"
                alt=""
                className="w-full"
              />
            </Link>
          </div>
          <div className="col-start-10 col-end-13">
            <p className="uppercase">
              A soft and romantic mint inspired by unstained affection and
              devotion. Amorist gently fuses green mint, peppermint and menthol,
              resulting in a restrained expression of a true quintessential.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
