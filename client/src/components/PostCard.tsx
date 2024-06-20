import { PostType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileDemo from "@/assets/profileImg.png";
import { useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/checkData";
import { Dot } from "lucide-react";
const PostCard = ({ postData }: { postData: PostType }) => {
  const navigate = useNavigate();

  const authorName = postData.authorName
    ? `${postData.authorName
        .charAt(0)
        .toUpperCase()}${postData.authorName.slice(1)}`
    : "";

  const createdAt = multiFormatDateString(postData.createdAt);

  //   const parser = new DOMParser();
  //   const document = parser.parseFromString(postData?.content, "text/html");
  //   console.log(document.body);

  return (
    <div className='flex flex-col items-start w-full border-b border-gray-400'>
      <div className='flex items-center justify-center gap-1'>
        <span
          className='flex items-center justify-center gap-2.5'
          onClick={() => navigate(`/profile/${postData?.authorId}`)}>
          <Avatar className='cursor-pointer size-7'>
            <AvatarImage
              src={postData?.authorAvatar}
              alt=''
            />
            <AvatarFallback>
              <img
                src={profileDemo}
                alt=''
              />
            </AvatarFallback>
          </Avatar>
          <p className='text-sm font-medium text-gray-600'>{authorName}</p>
        </span>
        <Dot className='text-gray-600 size-5' />
        <p className='text-sm font-medium text-gray-500'>{createdAt}</p>
      </div>

      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col'>
          <span className='text-xl font-bold'>{postData.title}</span>
          <span
            className='line-clamp-3'
            dangerouslySetInnerHTML={{ __html: postData.content }}></span>
        </div>
        <div className='border-2'>
          <img
            src={postData.previewImage}
            alt='Image'
          />
        </div>
      </div>
      <div>
        <span>
          <span>{}</span>
          <span></span>
        </span>
        <span></span>
      </div>
    </div>
  );
};
export default PostCard;
