import { Newspaper, Search, SquarePen } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between px-8 border-b-[0.01rem] py-2'>
      <span className='flex items-center justify-center gap-4'>
        <span className='flex items-center gap-1'>
          <Newspaper className='-mt-1 text-green-500 size-6' />
          <h1 className='text-xl font-bold tracking-tighter text-gray-700 font-logo'>
            Readpool.AI
          </h1>
        </span>
        <span className='flex justify-center items-center gap-2 bg-[#f6f6f6] px-3 py-0.5 rounded-full'>
          <Search className='text-gray-600 size-5 ' />
          <Input
            type='text'
            className='w-44 font-medium bg-[#F9F9F9] p-0 focus-visible:ring-0 border-0 shadow-none'
            placeholder='Search'
          />
        </span>
      </span>
      <span className='flex items-center gap-10'>
        <span className='flex items-center gap-2'>
          <SquarePen className='text-gray-600 size-5' />
          <p className='text-[14px]'>Write</p>
        </span>
        <Avatar className='cursor-pointer size-9'>
          <AvatarImage
            src='https://github.com/shadcn.png'
            alt='@shadcn'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </span>
    </div>
  );
};
export default Header;
