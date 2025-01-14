import { Newspaper, Search, SquarePen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";
import { useState } from "react";
import AskAi from "../AskAi";

const NoHeaderPageArray = ["/publish"];

const Header = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [askAiModal, setAskAiModal] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isNoHeaderPage = NoHeaderPageArray.indexOf(pathname);

  return isNoHeaderPage === -1 ? (
    <div className='flex items-center justify-between  px-2 sm:px-5 border-b-[0.01rem] border-gray-200 py-2'>
      <span className='flex items-center justify-center gap-4'>
        <span
          className='flex items-end justify-center gap-2 cursor-pointer'
          onClick={() => navigate("/")}>
          <Newspaper className='text-green-600 size-5 sm:size-5 md:size-7' />
          <h1 className='-mb-0.5 text-sm sm:text-md md:text-lg font-bold tracking-tighter text-gray-700 font-logo'>
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
      <span className='flex items-center gap-3 sm:gap-10'>
        <Search
          className='text-gray-500 cursor-pointer sm:hidden hover:text-gray-800 size-5'
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
          className=' text-[12px] sm:text-[14px] font-medium bg-gradient-to-r from-pink-500 to-purple-700  rounded-full  px-1.5 sm:px-2.5 text-white sm:py-1 py-0.5'
          onClick={() => setAskAiModal(!askAiModal)}>
          Ask AI
        </button>
        <HeaderDropdown />
      </span>
      {askAiModal ? <AskAi cancel={() => setAskAiModal(!askAiModal)} /> : null}
    </div>
  ) : null;
};
export default Header;
