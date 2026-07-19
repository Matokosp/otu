import Link from "next/link";
import Menu from "./Components/Menu/Menu";
import { Typing } from "./Components/Typing/Typing";

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-716px)]">
      <Menu page />
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-[10px] px-[10px] mt-[calc(50svh-40px)] uppercase">
        <div className="col-span-4 lg:col-start-4 lg:col-end-9 flex flex-col gap-y-[20px]">
          <p>Page not found.</p>
          <Link href="/shop" className="underline">
            <Typing text="Back to shop" />
          </Link>
        </div>
      </div>
    </main>
  );
}
