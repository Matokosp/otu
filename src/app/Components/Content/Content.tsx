import Link from "next/link";
import React from "react";
import { CustomImage } from "../Image/Image";

const Content = ({
  columns = 1,
  text,
  texts,
  menu,
  fixed,
}: {
  columns?: 1 | 2;
  text?: string;
  texts?: { title: string; text: string; id: string }[];
  menu?: {
    title: string;
    link: string;
  }[];
  fixed?: boolean;
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
      {menu && (
        <div className="lg:hidden w-[calc(50vw-10px)] ml-[50vw] absolute col-span-4">
          <ul className="flex flex-col gap-y-[10px]">
            {menu.map((item) => {
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
      <div
        className={`w-[calc(100vw/12*2)] px-[10px] grid lg:fixed ${
          text && fixed && "fixed"
        } ${
          menu
            ? "mt-[calc(50svh-72px)] mb-[55px] lg:mt-0 lg:mb-0 lg:top-[50svh]"
            : "top-[50svh]"
        } translate-y-[-50%] z-[999]`}
      >
        <div className="pl-[10%] min-w-[180px] translate-x-[-10px]">
          <Link href={"/"}>
            <CustomImage alt="" src="/images/logo.svg" className="w-full" />
          </Link>
        </div>
      </div>
      <div className="lg:col-span-3 hidden lg:block" />
      {content}
    </div>
  );
};

export default Content;
