import Header from "@/components/Header";
import SidebarLayout from "./SidebarLayout";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=''>
      <Header />
      <div className='max-w-[70rem] gap-24 flex w-full mx-auto flex-1'>
        <div className='flex-1'>{children}</div>
        <SidebarLayout />
      </div>
    </main>
  );
};
export default NavLayout;
