import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/_store";
const ProfileDropDown = ({ prop }: { prop: string }) => {
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.auth);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={` cursor-pointer ${prop}`}>
        <Ellipsis className='text-gray-700  size-5  md:size-6 lg:size-7' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-2 md:px-4 w-44'>
        <DropdownMenuItem className='my-1.5 md:my-2.5 text-gray-700 font-medium cursor-pointer '>
          <p className='text-xs md:text-sm'>Copy link to profile</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='my-1.5 md:my-2.5 text-gray-700 font-medium cursor-pointer '
          onClick={() => navigate("/reading-history")}>
          <p className='text-xs md:text-sm'>Reading history</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='my-1.5 md:my-2.5 text-gray-700 font-medium cursor-pointer '
          onClick={() => navigate(`/settings/${userId}`)}>
          <p className='text-xs md:text-sm'>Settings</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileDropDown;
