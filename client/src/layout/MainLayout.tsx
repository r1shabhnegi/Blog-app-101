import Header from "@/components/Header/Header";
import SidebarLayout from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Header />
      <div>
        <div className='flex flex-row mx-auto max-w-[75rem] px-2 justify-between '>
          <div className='flex-1 sm:mx-0 lg:mr-8 xl:mr-20'>
            <Outlet />
          </div>
          <SidebarLayout />
        </div>
      </div>
    </main>
  );
};
export default MainLayout;
