import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-[350px] uppercase p-[10px]">
      <div className="grid grid-cols-12 gap-x-[10px]">
        <div className="col-span-3"></div>
        <div className="col-span-3 flex flex-col gap-y-[50px]">
          <ul>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/shipping">Lead times & Shipping</Link>
            </li>
            <li>
              <Link href="/returns">Exchange & returns</Link>
            </li>
            <li>
              <Link href="/trade">Trade</Link>
            </li>
          </ul>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & conditions</li>
          </ul>
        </div>
        <div className="col-span-3">
          <p>
            instagram <br />
            <a
              className="opacity-50"
              href="https://www.instagram.com/oftheuseless"
            >
              @OFTHEUSELESS
            </a>
          </p>
        </div>
      </div>
      <div className="text-right mt-[200px]">
        <p>all content © of the useless 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
