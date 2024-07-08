import HomeSidebar from "@/components/HomeSidebar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useLocation } from "react-router-dom";

const SidebarLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className='relative min-h-full border-gray-200 border-l-[0.01rem]'>
      <div className=' sticky -top-24 w-[21rem] '>
        <div className='pt-10 pl-10 pr-4'>
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
