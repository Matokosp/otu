import Link from "next/link";
import { Typing } from "../Typing/Typing";
import RegionSelector from "./RegionSelector";
import { getServerRegion } from "@/app/lib/market";

const Footer = async () => {
  const region = await getServerRegion();

  return (
    <footer className="mt-[350px] uppercase p-[10px]">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-[10px]">
        <div className="lg:col-span-3 col-span-2"></div>
        <div className="lg:col-span-3 col-span-2 flex flex-col gap-y-[30px] lg:gap-y-[50px]">
          <ul>
            <li>
              <Link href="/about">
                <Typing text="About" />
              </Link>
            </li>
            <li>
              <Link href="/info">
                <Typing text="Contact" />
              </Link>
            </li>
            <li>
              <Link href="/info">
                <Typing text="Lead times & Shipping" />
              </Link>
            </li>
            {/* <li>
              <Link href="/info">
                <Typing text="Payments" />
              </Link>
            </li> */}
            {/* <li>
              <Link href="/info">
                <Typing text="Custom pieces" />
                </Link>
                </li> */}
            <li>
              <Link href="/info">
                <Typing text="Exchange & returns" />
              </Link>
            </li>
            <li>
              <Link href="/info">
                <Typing text="Trade" />
              </Link>
            </li>
            <li>
              {/* Withdrawal function ("ångerknapp") required by distansavtalslagen since 19 June 2026.
                  Official customer accounts URL from Shopify admin → Settings → Customer accounts. */}
              <a href="https://shopify.com/95940903255/account">
                <Typing text="Cancel your order" />
              </a>
            </li>
          </ul>
          <ul className="lg:hidden">
            <li>
              <Link href={"/about"}>About</Link>
            </li>
          </ul>
          <RegionSelector initialRegion={region} />
          <ul>
            <li>
              <Link href={"/policies/privacy-policy"}>
                <Typing text="Privacy Policy" />
              </Link>
            </li>
            <li>
              <Link href={"/policies/terms-of-service"}>
                <Typing text="Terms & conditions" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:hidden col-span-2" />
        <div className="lg:col-span-3 col-span-2 mt-[30px] lg:mt-0">
          <p>
            instagram <br />
            <a
              target="_blank"
              className="opacity-50"
              href="https://www.instagram.com/oftheuseless"
            >
              <Typing text="@OFTHEUSELESS" />
            </a>
          </p>
        </div>
      </div>
      <div className="lg:text-right lg:mt-[200px] mt-[150px]">
        <p>all content © of the useless {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
