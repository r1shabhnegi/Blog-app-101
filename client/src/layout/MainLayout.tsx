import Header from "@/components/Header/Header";
import SidebarLayout from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <main className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-row mx-auto'>
        <div className='max-w-full mx-2 sm:mx-0 sm:w-[40rem] md:w-[46rem] lg:w-[43rem] lg:mr-8 xl:mr-20'>
          <Outlet />
        </div>
        <SidebarLayout />
      </div>
    </main>
  );
};
export default MainLayout;
