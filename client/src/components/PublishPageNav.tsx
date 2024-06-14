import { Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { useAppSelector } from "@/redux/hook";

const PublishPageNav = () => {
  const navigate = useNavigate();
  const { avatar } = useAppSelector((state) => state.auth);
  return (
    <div className='flex justify-between py-4'>
      <span
        className='flex items-center gap-1 cursor-pointer'
        onClick={() => navigate("/")}>
        <Newspaper className='-mt-1 text-green-500 size-6' />
        <h1 className='text-xl font-bold tracking-tighter text-gray-700 font-logo'>
          Readpool.AI
        </h1>
      </span>
      <span className='flex items-center gap-6'>
        <button className='px-3 text-[13px] h-8 font-medium text-white bg-green-600 rounded-full '>
          Publish
        </button>
        <Avatar
          className='cursor-pointer size-9'
          onClick={() => navigate("/profile/1")}>
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
      </span>
    </div>
  );
};
export default PublishPageNav;
