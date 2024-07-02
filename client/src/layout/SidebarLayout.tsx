import ProfileSidebar from "@/components/ProfileSidebar";
import { useLocation } from "react-router-dom";

const SidebarLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className='border-l-[0.01rem] border-gray-200 w-[21rem] h-96'>
      <div className='pl-10 pr-4 mt-10'>
        {pathname.startsWith("/profile") ||
        pathname.startsWith("/reading-history") ||
        pathname.startsWith("/followers") ? (
          <ProfileSidebar />
        ) : null}
      </div>
    </div>
  );
};
export default SidebarLayout;
