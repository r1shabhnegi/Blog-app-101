import Header from "@/components/Header";
import SidebarLayout from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-row mx-auto'>
        <div className='w-[24rem] sm:w-[35rem] lg:w-[40rem] xl:w-[50rem] lg:pr-5 xl:mr-20'>
          <Outlet />
        </div>
        <SidebarLayout />
      </div>
    </main>
  );
};
export default MainLayout;
