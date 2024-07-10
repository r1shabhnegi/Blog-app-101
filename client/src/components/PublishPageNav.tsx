import { Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { useAppSelector } from "@/redux/hook";

const PublishPageNav = ({
  setIsPublish,
  isPublish,
}: {
  setIsPublish: () => void;
  isPublish: boolean;
}) => {
  const navigate = useNavigate();
  const { avatar, userId } = useAppSelector((state) => state.auth);
  return (
    <div className='flex justify-between px-4 py-2'>
      <span
        className='flex items-center gap-1 cursor-pointer'
        onClick={() => navigate("/")}>
        <Newspaper className='-mt-1 text-green-600 size-5 md:size-6' />
        <h1 className='text-lg font-bold tracking-tighter text-gray-700 md:text-xl font-logo'>
          Readpool.AI
        </h1>
      </span>
      <span className='flex items-center gap-6'>
        <button
          className={` px-2 sm:px-3 text-[11px] md:text-[13px] h-7 sm:h-8 font-medium text-white bg-green-600 rounded-full  ${
            !isPublish && "bg-opacity-30"
          }`}
          onClick={setIsPublish}
          disabled={!isPublish}>
          Publish
        </button>
        <Avatar
          className='cursor-pointer size-7 sm:size-8 md:size-9'
          onClick={() => navigate(`/profile/${userId}`)}>
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
