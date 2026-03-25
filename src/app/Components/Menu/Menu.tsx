"use client";

import Link from "next/link";
import { useGlobalContext } from "@/app/context/store";
import { Typing } from "../Typing/Typing";
import { Cart } from "../Cart/Cart";
import { useState } from "react";

const Menu = ({
  page,
  product,
  shop
}: {
  page?: boolean;
  product?: boolean;
  fixed?: boolean;
  shop?: boolean;
}) => {
  const [cartOpen, setCartOpen] = useState(false);

  const { windowHeight, setIsFilteredShop, isFilteredShop, cartCount, refreshCartCount } = useGlobalContext();

  const handleCartClose = () => {
    setCartOpen(false);
    refreshCartCount();
  };

  return (
    <div
      className={`z-[999] sticky top-0 flex flex-col pointer-events-none w-screen`}
      style={{ height: !page && !product ? windowHeight : "" }}
    >
      <Cart isOpen={cartOpen} onClose={handleCartClose} />
      <nav className="grid lg:grid-cols-12 grid-cols-4 p-[10px] gap-x-[10px] mb-[25px] w-screen">
        <p className="uppercase col-span-3 pointer-events-auto hidden lg:block">
          {/* <Link className="lg:hidden" href={"/"}>
            {product ? (
              <Typing text="no hard feelings chair <br> — oiled oak" />
            ) : (
              <Typing text="release 01 <br> — Stockholm, Sweden" />
            )}
          </Link> */}
          <Link className="hidden lg:block" href={"/"}>
            <Typing text="release 01 <br> — Stockholm, Sweden" />
          </Link>
        </p>
        <div className="relative group lg:col-span-3">
          <p onClick={() => setIsFilteredShop(null)} className="uppercase pointer-events-auto relative">
            <Link href="/shop">
              <Typing text="shop" />
            </Link>
          </p>
          {!product && (
            <div className={`absolute left-[calc(50vw-5px)] lg:left-0 pt-[50px] ${shop ? 'opacity-100' : 'opacity-0'} lg:pointer-events-auto pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition`}>
            <p className={`${isFilteredShop === null ? 'text-black' : 'text-gray-400 hover:text-black'}`} onClick={() => setIsFilteredShop(null)}><Link href="/shop">ALL</Link></p>
            <p className={`${isFilteredShop === 'Furniture' ? 'text-black' : 'text-gray-400 hover:text-black'}`} onClick={() => setIsFilteredShop('Furniture')}><Link href="/shop">FURNITURE</Link></p>
            <p className={`${isFilteredShop === 'Objects' ? 'text-black' : 'text-gray-400 hover:text-black'}`} onClick={() => setIsFilteredShop('Objects')}><Link href="/shop">OBJECTS</Link></p>
            <p className={`${isFilteredShop === 'Found & Antiques' ? 'text-black' : 'text-gray-400 hover:text-black'}`} onClick={() => setIsFilteredShop('Found & Antiques')}><Link href="/shop">ANTIQUE</Link></p>
          </div>
          )}
        </div>
        <p className="uppercase col-span-3 pointer-events-auto hidden lg:block">
          <Link href="/about">
            <Typing text="about" />
          </Link>
        </p>
        <p onClick={() => setCartOpen(true)} className="uppercase col-span-3 pointer-events-auto cursor-pointer text-right lg:text-left">
          cart {cartCount > 0 ? ` [${cartCount}]` : "[0]"}
        </p>
      </nav>
      {!page && !product && (
        <a
          href="/shop"
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
