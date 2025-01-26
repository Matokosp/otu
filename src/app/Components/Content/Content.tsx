import Link from "next/link";
import React from "react";
import { CustomImage } from "../Image/Image";

const Content = ({
  columns = 1,
  text,
  texts,
}: {
  columns?: 1 | 2;
  text?: string;
  texts?: [{ title: string; text: string }];
}) => {
  const content =
    columns === 1 && text ? (
      <div
        className="col-start-4 col-end-9"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    ) : (
      <>
        {texts?.map((item) => {
          return (
            <React.Fragment key={item.title}>
              <div
                className="col-start-4 col-end-6"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <div
                className="col-start-6 col-end-11"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  return (
    <div className="grid grid-cols-12 gap-x-[10px] uppercase gap-y-[35px]">
      <div className="w-[calc(100vw/12*2)] px-[10px] grid fixed top-[50vh] translate-y-[-50%] z-[999]">
        <div className="pl-[10%]">
          <Link href={"/"}>
            <CustomImage alt="" src="/images/logo.svg" className="w-full" />
          </Link>
        </div>
      </div>
      <div className="xl:col-span-3" />
      {content}
    </div>
  );
};

export default Content;
