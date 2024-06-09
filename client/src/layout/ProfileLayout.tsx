import { useAppSelector } from "@/redux/hook";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ProfileLayout = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const { name } = useAppSelector((state) => state.auth);

  const nameFirstLetter = name?.slice(0, 1).toUpperCase();
  const nameRestLetters = name?.slice(1);
  const adminName =
    nameFirstLetter && nameRestLetters
      ? `${nameFirstLetter}${nameRestLetters}`
      : "There is no name";

  return (
    <div>
      <div className='flex flex-col justify-between h-32 my-16'>
        <div className='flex items-center justify-between'>
          <h1 className='text-5xl font-semibold tracking-tight text-gray-800 '>
            {adminName}
          </h1>
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
        </div>

        <div className='flex gap-7 border-b-[0.01rem] border-gray-200'>
          <span
            className={`text-sm font-medium pb-4 text-gray-600 cursor-pointer ${
              pathname.startsWith("/profile") &&
              !pathname.includes("list") &&
              !pathname.includes("about")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/${1}`)}>
            Home
          </span>
          <span
            className={`text-sm font-medium pb-4 cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/lists")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/lists/${1}`)}>
            Lists
          </span>
          <span
            className={`text-sm font-medium pb-4 cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/about")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/about/${1}`)}>
            About
          </span>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default ProfileLayout;
