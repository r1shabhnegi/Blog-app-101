import { commentType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { multiFormatDateString } from "@/lib/checkData";

const CommentCard = ({ commentData }: { commentData: commentType }) => {
  const authorName = commentData.authorName
    ? `${commentData.authorName
        .charAt(0)
        .toUpperCase()}${commentData.authorName.slice(1)}`
    : "";
  const createdDate = multiFormatDateString(commentData.createdAt);
  return (
    <div className='flex flex-col w-full gap-3 py-2 border-b border-gray-300'>
      <div className=''>
        <div className='flex items-center gap-3'>
          <Avatar className='cursor-pointer size-7'>
            <AvatarImage
              src={commentData.authorAvatar}
              alt=''
            />
            <AvatarFallback>
              <img
                src={profileDemo}
                alt=''
              />
            </AvatarFallback>
          </Avatar>
          <span className='flex flex-col'>
            <p className='text-[13px]'>{authorName}</p>
            <p className='text-xs text-gray-600'>{createdDate}</p>
          </span>
        </div>
      </div>
      <div>
        <p className='text-[13px]'>{commentData.content}</p>
      </div>
    </div>
  );
};
export default CommentCard;
