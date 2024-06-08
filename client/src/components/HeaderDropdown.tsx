import { LogOut, Settings, User } from "lucide-react";

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
import { useAppDispatch } from "@/redux/hook";
import { setLogout } from "@/redux/authSlice";

const HeaderDropdown = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 mt-0.5 mr-2'>
        <DropdownMenuLabel className='text-gray-700'>
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='my-1 text-gray-700 cursor-pointer'
            onClick={() => navigate("/profile")}>
            <User className='w-4 h-4 mr-2' />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className='my-1 text-gray-700 cursor-pointer'>
            <Settings className='w-4 h-4 mr-2' />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='my-1 text-gray-700 cursor-pointer'
            onClick={() => handleLogout()}>
            <LogOut className='w-4 h-4 mr-2' />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default HeaderDropdown;
