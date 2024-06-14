import { Newspaper, Search, SquarePen } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between px-6 border-b-[0.01rem] border-gray-200 py-2'>
      <span className='flex items-center justify-center gap-4'>
        <span
          className='flex items-center gap-1 cursor-pointer'
          onClick={() => navigate("/")}>
          <Newspaper className='-mt-1 text-green-500 size-6' />
          <h1 className='text-xl font-bold tracking-tighter text-gray-700 font-logo'>
            Readpool.AI
          </h1>
        </span>
        <span className='flex justify-center items-center gap-2 bg-[#f6f6f6] px-3 py-0.5 rounded-full'>
          <Search className='text-gray-500 size-5 ' />
          <Input
            type='text'
            className='w-44 font-medium bg-[#F9F9F9] p-0 focus-visible:ring-0 border-0 shadow-none'
            placeholder='Search'
          />
        </span>
      </span>
      <span className='flex items-center gap-10'>
        <span
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => navigate("/publish")}>
          <SquarePen className='text-gray-500 size-5' />
          <p className='text-[14px] text-gray-600 font-medium'>Write</p>
        </span>
        <HeaderDropdown />
      </span>
    </div>
  );
};
export default Header;
