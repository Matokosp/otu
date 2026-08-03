import { Metadata } from "next";
import Content from "../Components/Content/Content";
import Menu from "../Components/Menu/Menu";

export const metadata: Metadata = {
  title: "About - OF THE USELESS",
  description:
    "OF THE USELESS is an independent brand based in Stockholm, Sweden. We design, handcraft, and produce pieces for the everyday, with locally sourced materials.",
  openGraph: {
    url: "https://oftheuseless.com/about",
    title: "About - OF THE USELESS",
    description:
      "OF THE USELESS is an independent brand based in Stockholm, Sweden. We design, handcraft, and produce pieces for the everyday, with locally sourced materials.",
    siteName: "OF THE USELESS",
    images: [{ url: "/images/meta/hero_image.jpg" }],
  },
};

const Page = () => {
  return (
    <div className="relative min-h-[calc(100vh-716px)]">
      <Menu page fixed />
      <div className="lg:h-[180px] h-[160px]"></div>
      <Content
        fixed
        text={`<p>OF THE USELESS is An independent BRAND based in Stockholm, Sweden.
we design, handcraft, and produce PIECES for the everyday, with locally sourced materials.</p>
<br><br>
<p>unapologetically and down to the last detail.</p>`}
      />
    </div>
  );
};

export default Page;
