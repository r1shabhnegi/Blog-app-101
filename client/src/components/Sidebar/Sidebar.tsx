import React from "react";
import { useLocation } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";
import HomeSidebar from "./HomeSidebar";

const sidebarConfig = {
  "/profile": ProfileSidebar,
  "/reading-history": ProfileSidebar,
  "/followers": ProfileSidebar,
  "/settings": ProfileSidebar,
  "/": HomeSidebar,
  "/feed-following": HomeSidebar,
  "/tag-suggestions": HomeSidebar,
};

const NoSidebarPageArray = ["/publish", "/tag", "/post"];

const SidebarLayout = () => {
  const { pathname } = useLocation();
  const SidebarComponent = Object.keys(sidebarConfig).find((key) =>
    pathname.startsWith(key)
  );

  const shouldShowSidebar = !NoSidebarPageArray.includes(
    `/${pathname.split("/")[1]}`
  );

  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <div className='border-gray-200 lg:border-l-[0.01rem]'>
      <div className='sticky top-0 hidden md:block md:w-[14rem] lg:w-[18rem] xl:w-[21rem]'>
        <div className='pt-12 md:pl-2 lg:pl-7 xl:pl-10'>
          {SidebarComponent &&
          sidebarConfig[SidebarComponent as keyof typeof sidebarConfig]
            ? React.createElement(
                sidebarConfig[SidebarComponent as keyof typeof sidebarConfig]
              )
            : null}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
