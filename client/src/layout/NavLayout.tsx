import Header from "@/components/Header";
import SidebarLayout from "./SidebarLayout";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex flex-col'>
      <Header />
      <div className='lg:px-4 flex-1 justify-between max-w-[70rem] lg:gap-20 xl:gap-24 flex w-full mx-auto'>
        <div className='flex-1'>{children}</div>
        <SidebarLayout />
      </div>
    </main>
  );
};
export default NavLayout;
