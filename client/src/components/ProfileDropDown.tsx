import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
const ProfileDropDown = () => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='cursor-pointer'>
        <Ellipsis className='text-gray-700' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-4 w-44'>
        <DropdownMenuItem className='my-2.5 text-gray-700 font-medium cursor-pointer '>
          <span>Copy link to profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='my-2.5 text-gray-700 font-medium cursor-pointer '
          onClick={() => navigate("/reading-history")}>
          <span>Reading history</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='my-2.5 text-gray-700 font-medium cursor-pointer '
          onClick={() => navigate("/settings")}>
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileDropDown;
