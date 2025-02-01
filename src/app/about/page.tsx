import Content from "../Components/Content/Content";
import Menu from "../Components/Menu/Menu";

const Page = () => {
  return (
    <div className="relative min-h-[calc(100vh-716px)]">
      <Menu page fixed />
      <div className="lg:h-[180px] h-[160px]"></div>
      <Content
        fixed
        text={`<p>A soft and romantic mint inspired by unstained affection and devotion. Amorist gently fuses green mint, peppermint and menthol, resulting in a restrained expression of a true quintessential.</p>`}
      />
    </div>
  );
};

export default Page;
