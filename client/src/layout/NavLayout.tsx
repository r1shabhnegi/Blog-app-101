import Header from "@/components/Header";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex flex-col'>
      <Header />
      <div className='flex-1'>{children}</div>
    </main>
  );
};
export default NavLayout;
