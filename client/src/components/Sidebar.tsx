import React from "react";
import { useLocation } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import HomeSidebar from "./HomeSidebar";

const sidebarConfig = {
  "/profile": ProfileSidebar,
  "reading-history": ProfileSidebar,
  "/followers": ProfileSidebar,
  "/": HomeSidebar,
  "/settings": HomeSidebar,
  "feed-following": HomeSidebar,
};

const NoSidebarPageArray = ["/publish"];

const SidebarLayout = () => {
  const { pathname } = useLocation();
  const SidebarComponent = Object.keys(sidebarConfig).find((key) =>
    pathname.startsWith(key)
  ) as keyof typeof sidebarConfig;

  const isNoHeaderPage = NoSidebarPageArray.indexOf(pathname);

  return isNoHeaderPage === -1 ? (
    <div className='min-h-full border-gray-200 lg:border-l-[0.01rem]'>
      <div className='sticky -top-24 w-[21rem] hidden lg:block md:w-[18rem] xl:w-[21rem]'>
        <div className='pt-5 pl-5 xl:pt-10 xl:pl-10'>
          {SidebarComponent
            ? React.createElement(sidebarConfig[SidebarComponent])
            : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default SidebarLayout;
