import HomeSidebar from "@/components/HomeSidebar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useLocation } from "react-router-dom";

const SidebarLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className='relative'>
      <div className=' border-l-[0.01rem] sticky -top-24 border-gray-200 w-[21rem] h-96'>
        <div className='pt-10 pl-10 pr-4'>
          {pathname.startsWith("/profile") ||
          pathname.startsWith("/reading-history") ||
          pathname.startsWith("/followers") ? (
            <ProfileSidebar />
          ) : null}
          {pathname === "/" ? <HomeSidebar /> : null}
        </div>
      </div>
    </div>
  );
};
export default SidebarLayout;
