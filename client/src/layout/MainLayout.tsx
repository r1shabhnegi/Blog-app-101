import Header from "@/components/Header";
import SidebarLayout from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const NavLayout = () => {
  return (
    <main className='flex flex-col'>
      <Header />
      <div className='flex flex-row mx-auto'>
        <Outlet />
        <SidebarLayout />
      </div>
    </main>
  );
};
export default NavLayout;
