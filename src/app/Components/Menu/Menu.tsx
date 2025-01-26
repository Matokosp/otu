import Link from "next/link";

const Menu = ({ page, product }: { page?: boolean; product?: boolean }) => {
  return (
    <div
      className={`z-[999] sticky top-0 flex flex-col justify-between pointer-events-none ${
        !page && "h-screen"
      }`}
    >
      <nav className="grid grid-cols-12 p-[10px] gap-x-[10px] mb-[25px] w-screen">
        <p className="uppercase col-span-3 pointer-events-auto">
          <Link href={"/"}>
            release 01 <br />— Stockholm, Sweden
          </Link>
        </p>
        <p className="uppercase col-span-3 pointer-events-auto">
          <Link href="/about">about</Link>
        </p>
        <p className="uppercase col-span-3 pointer-events-auto">
          <Link href="/contact">contact</Link>
        </p>
      </nav>
      {!page && !product && (
        <div className="grid-cols-4 xl:grid-cols-12 grid gap-x-[10px] p-[10px] uppercase w-full">
          <div className="col-span-3">
            <p>Introducing</p>
          </div>
          <div className="col-span-3">
            <p>No Hard Feelings Chair</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
