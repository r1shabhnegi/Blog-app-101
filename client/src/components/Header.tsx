import { Newspaper, Search, SquarePen } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";
import { useState } from "react";

const Header = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [askAiModal, setAskAiModal] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between px-4 sm:px-6 border-b-[0.01rem] border-gray-200 py-2'>
      <span className='flex items-center justify-center gap-4'>
        <span
          className='flex items-center gap-1 cursor-pointer'
          onClick={() => navigate("/")}>
          <Newspaper className='-mt-1 text-green-600 size-5 md:size-6' />
          <h1 className='text-lg font-bold tracking-tighter text-gray-700 md:text-xl'>
            Readpool.AI
          </h1>
        </span>
        <span className='flex justify-center items-center gap-2 bg-[#f6f6f6] px-3 py-0.5 rounded-full'>
          <Input
            type='text'
            className='w-44 hidden sm:block font-medium bg-[#F9F9F9] p-0 focus-visible:ring-0 border-0 shadow-none'
            placeholder='Search topics'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search
            className='hidden text-gray-500 cursor-pointer md:block hover:text-gray-800 size-full'
            onClick={() => navigate(`/tag/${searchValue}`)}
          />
        </span>
      </span>
      <span className='flex items-center gap-5 sm:gap-10'>
        <Search
          className='text-gray-500 cursor-pointer sm:hidden hover:text-gray-800 size-full'
          onClick={() => navigate(`/tag/${searchValue}`)}
        />
        <span
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => navigate("/publish")}>
          <SquarePen className='text-gray-500 size-5' />
          <p className='text-[14px] text-gray-600 font-medium hidden md:block'>
            Write
          </p>
        </span>
        <button
          className='text-[14px] font-medium bg-gradient-to-r from-pink-500 to-purple-700  rounded-full px-2.5 text-white py-1'
          onClick={() => setAskAiModal(!askAiModal)}>
          Ask AI
        </button>
        <HeaderDropdown />
      </span>
      {
        askAiModal? 
      }
    </div>
  );
};
export default Header;
