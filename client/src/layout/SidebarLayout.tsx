import HomeSidebar from "@/components/HomeSidebar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useLocation } from "react-router-dom";

const SidebarLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className='relative min-h-full border-gray-200 lg:border-l-[0.01rem]'>
      <div className=' sticky -top-24 w-[21rem] hidden lg:block md:w-[18rem] xl:w-[21rem] '>
        <div className='pt-5 pl-5 xl:pt-10 xl:pl-10'>
          {pathname.startsWith("/profile") ||
          pathname.startsWith("/reading-history") ||
          pathname.startsWith("/followers") ? (
            <ProfileSidebar />
          ) : null}
          {pathname === "/" || pathname === "/feed-following" ? (
            <HomeSidebar />
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default SidebarLayout;
