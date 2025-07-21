import Content from "../Components/Content/Content";
import Menu from "../Components/Menu/Menu";

const Page = () => {
  return (
    <div className="relative min-h-[calc(100vh-716px)]">
      <Menu page fixed />
      <div className="lg:h-[180px] h-[160px]"></div>
      <Content
        fixed
        text={`<p>OF THE USELESS is an independent brand based in Stockholm, Sweden.
we design, handcraft, and produce pieces for the everyday, with locally sourced materials.</p>
<br><br>
<p>Unapologetically and down to the last detail.</p>`}
      />
    </div>
  );
};

export default Page;
