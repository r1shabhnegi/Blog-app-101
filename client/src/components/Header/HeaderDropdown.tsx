import { History, LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/authApi";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLogout } from "@/redux/authSlice";
import profileDemo from "@/assets/profileImg.png";

const HeaderDropdown = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { avatar, userId } = useAppSelector((state) => state.auth);

  const { mutateAsync: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(setLogout());
      navigate("/");
      toast({
        title: "Logged out successfully!",
        className: "bg-green-400",
      });
    },
    onError: () => {
      toast({
        title: "Logged out failed!",
        className: "bg-red-400",
      });
    },
  });

  const handleLogout = async () => {
    await mutateLogout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer size-7 sm:size-8 md:size-9'>
          <AvatarImage
            src={avatar}
            alt=''
          />
          <AvatarFallback>
            <img
              src={profileDemo}
              alt=''
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1.5 md:p-2 mr-6 w-44 sm:w-48 md:w-60'>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='gap-2 sm:my-2 md:my-3 font-medium text-gray-600 cursor-pointer'
            onClick={() => navigate(`/profile/${userId}`)}>
            <User className='mr-2 size-4 md:size-5' />
            <span className='text-[12px]  md:text-[13px] lg:text-[14px]'>
              Profile
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='gap-2 sm:my-2 md:my-3 font-medium text-gray-600 cursor-pointer'
            onClick={() => navigate(`/settings/${userId}`)}>
            <Settings className='mr-2 size-4 md:size-5' />
            <span className='text-[12px]  md:text-[13px] lg:text-[14px]'>
              Settings
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='gap-2 sm:my-2 md:my-3  font-medium text-gray-600 cursor-pointer'
            onClick={() => navigate(`/reading-history/${userId}`)}>
            <History className='mr-2 size-4 md:size-5' />
            <span className='text-[12px]  md:text-[13px] lg:text-[14px]'>
              Reading history
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='gap-2 sm:my-2 md:my-3 font-medium text-gray-600 cursor-pointer'
            onClick={() => handleLogout()}>
            <LogOut className='mr-2 size-4 md:size-5' />
            <span className='text-[12px]  md:text-[13px] lg:text-[14px]'>
              Log out
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default HeaderDropdown;
