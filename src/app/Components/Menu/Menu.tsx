"use client";

import Link from "next/link";
import { useGlobalContext } from "@/app/context/store";
import { Typing } from "../Typing/Typing";

const Menu = ({
  page,
  product,
}: {
  page?: boolean;
  product?: boolean;
  fixed?: boolean;
}) => {
  const { windowHeight } = useGlobalContext();
  return (
    <div
      className={`z-[999] sticky top-0 flex flex-col pointer-events-none w-screen`}
      style={{ height: !page && !product ? windowHeight : "" }}
    >
      <nav className="grid lg:grid-cols-12 grid-cols-4 p-[10px] gap-x-[10px] mb-[25px] w-screen">
        <p className="uppercase col-span-3 pointer-events-auto">
          <Link className="lg:hidden" href={"/"}>
            {product ? (
              <Typing text="no hard feelings chair <br> — oiled oak" />
            ) : (
              <Typing text="release 01 <br> — Stockholm, Sweden" />
            )}
          </Link>
          <Link className="hidden lg:block" href={"/"}>
            <Typing text="release 01 <br> — Stockholm, Sweden" />
          </Link>
        </p>
        <p className="uppercase lg:col-span-3 text-right lg:text-left pointer-events-auto">
          <Link href="/shop/no-hard-feelings">
            <Typing text="shop" />
          </Link>
        </p>
        <p className="uppercase col-span-3 pointer-events-auto hidden lg:block">
          <Link href="/about">
            <Typing text="about" />
          </Link>
        </p>
      </nav>
      {!page && !product && (
        <a
          href="/shop/no-hard-feelings"
          className="grid-cols-4 lg:grid-cols-12 grid gap-x-[10px] p-[10px] block uppercase w-screen absolute bottom-0 pointer-events-auto"
        >
          <div className="lg:col-span-3 col-span-4 hidden lg:block">
            <Typing text="Introducing" />
          </div>
          <div className="lg:col-span-3 col-span-4 flex gap-x-[10px]">
            <p className="lg:hidden">
              <Typing text="Introducing" />
            </p>
            <Typing text="No Hard Feelings Chair" />
          </div>
        </a>
      )}
    </div>
  );
};

export default Menu;
