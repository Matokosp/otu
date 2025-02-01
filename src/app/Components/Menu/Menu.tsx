"use client";

import Link from "next/link";
import { useGlobalContext } from "@/app/context/store";

const Menu = ({ page, product }: { page?: boolean; product?: boolean }) => {
  const { windowHeight } = useGlobalContext();
  return (
    <div
      className={`z-[999] sticky top-0 flex flex-col pointer-events-none`}
      style={{ height: !page ? windowHeight : "" }}
    >
      <nav className="grid lg:grid-cols-12 grid-cols-4 p-[10px] gap-x-[10px] mb-[25px] w-screen">
        <p className="uppercase col-span-3 pointer-events-auto">
          <Link href={"/"}>
            release 01 <br />— Stockholm, Sweden
          </Link>
        </p>
        <p className="uppercase lg:col-span-3 text-right lg:text-left pointer-events-auto">
          <Link href="/about">about</Link>
        </p>
        <p className="uppercase col-span-3 pointer-events-auto hidden lg:block">
          <Link href="/info#contact">contact</Link>
        </p>
      </nav>
      {!page && !product && (
        <div className="grid-cols-4 xl:grid-cols-12 grid gap-x-[10px] p-[10px] uppercase w-full absolute bottom-0">
          <div className="lg:col-span-3 col-span-4 hidden lg:block">
            <p>Introducing</p>
          </div>
          <div className="lg:col-span-3 col-span-4 flex gap-x-[10px]">
            <p className="lg:hidden">Introducing</p>
            <p>No Hard Feelings Chair</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
