import Link from "next/link";
import React from "react";
import { CustomImage } from "../Image/Image";

const Content = ({
  columns = 1,
  text,
  texts,
  menu,
}: {
  columns?: 1 | 2;
  text?: string;
  texts?: { title: string; text: string; id: string }[];
  menu?: {
    title: string;
    link: string;
  }[];
}) => {
  const content =
    columns === 1 && text ? (
      <div
        className="col-span-4 lg:col-start-4 lg:col-end-9"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    ) : (
      <>
        {texts?.map((item) => {
          return (
            <React.Fragment key={item.title}>
              <div
                className="col-span-4 mb-[10px] lg:mb-0 lg:col-start-4 lg:col-end-6 scroll-mt-[150px]"
                dangerouslySetInnerHTML={{ __html: item.title }}
                id={item.id}
              />
              <div
                className="col-span-4 mb-[35px] lg:mb-0 lg:col-start-6 lg:col-end-11"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-[10px] px-[10px] uppercase lg:gap-y-[35px]">
      <div
        className={`w-[calc(100vw/12*2)] px-[10px] grid fixed ${
          menu ? "top-[410px]" : "top-[50vh]"
        } translate-y-[-50%] z-[999]`}
      >
        <div className="pl-[10%] min-w-[180px]">
          <Link href={"/"}>
            <CustomImage alt="" src="/images/logo.svg" className="w-full" />
          </Link>
        </div>
      </div>
      {menu && (
        <div className="lg:hidden fixed top-[100px] w-[50vw] left-[50vw]">
          <ul className="flex flex-col gap-y-[10px]">
            {menu.map((item, i) => {
              return (
                <li key={item.title}>
                  <p>
                    <a href={item.link}>{item.title}</a>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="lg:col-span-3 hidden lg:block" />
      {content}
    </div>
  );
};

export default Content;
