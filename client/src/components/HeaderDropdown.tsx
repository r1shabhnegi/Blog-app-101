import { History, LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../api";
import { useToast } from "./ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLogout } from "@/redux/authSlice";

const HeaderDropdown = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.auth);

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
        <Avatar className='cursor-pointer size-9'>
          <AvatarImage
            src=''
            alt=''
          />
          <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-3 mr-2 w-60'>
        {/* <DropdownMenuLabel className='mb-2 text-gray-700'>
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='gap-2 my-3 font-medium text-gray-600 cursor-pointer'
            onClick={() => navigate("/profile/1")}>
            <User className='mr-2 size-5' />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className='gap-2 my-3 font-medium text-gray-600 cursor-pointer'>
            <Settings className='mr-2 size-5' />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className='gap-2 my-3 font-medium text-gray-600 cursor-pointer'>
            <History className='mr-2 size-5' />
            <span>Reading history</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='gap-2 my-3 font-medium text-gray-600 cursor-pointer'
            onClick={() => handleLogout()}>
            <LogOut className='mr-2 size-5' />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default HeaderDropdown;
