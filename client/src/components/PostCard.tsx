import { PostType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileDemo from "@/assets/profileImg.png";
import { useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/checkData";
import { Bookmark, Dot, Ellipsis } from "lucide-react";
import { useAppSelector } from "@/redux/hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const PostCard = ({ postData }: { postData: PostType }) => {
  const navigate = useNavigate();
  const { userId } = useAppSelector((state) => state.auth);
  const isMod: boolean = postData?.authorId === userId ? true : false;
  console.log(isMod);

  const authorName = postData.authorName
    ? `${postData.authorName
        .charAt(0)
        .toUpperCase()}${postData.authorName.slice(1)}`
    : "";

  const createdAt = multiFormatDateString(postData.createdAt);

  // const handleDeletePost;

  return (
    <div className='flex flex-col items-start w-full py-2 border-b border-gray-300'>
      <div className='flex items-center justify-center gap-1 mb-1'>
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
          <p className='text-sm font-medium text-gray-800'>{authorName}</p>
        </span>
        <Dot className='text-gray-600 size-5' />
        <p className='text-sm font-medium text-gray-800'>{createdAt}</p>
      </div>

      <div className='flex items-center justify-between w-full mb-8'>
        <div className='flex flex-col text-wrap w-[35rem]'>
          <span className='text-xl font-bold text-gray-900 '>
            {postData.title}
          </span>
          <span
            className='text-gray-900 line-clamp-3 htmlContentCard'
            dangerouslySetInnerHTML={{ __html: postData.content }}></span>
        </div>
        {postData.previewImage && postData.previewImage !== "" ? (
          <div className='size-28'>
            <img
              src={postData.previewImage}
              alt='Img'
              className='object-cover w-full size-28'
            />
          </div>
        ) : null}
      </div>
      <div className='flex items-center justify-between w-full mb-8'>
        <div className='flex gap-2'>
          <p className='pb-1 px-2.5 pt-0.5 text-xs font-medium text-center text-gray-900 bg-gray-200 rounded-full '>
            {postData.tag}
          </p>

          <p className='pb-1 px-2.5 pt-0.5 text-xs font-medium text-center text-gray-600'>
            {postData.readTime} min
          </p>
        </div>

        <div className='mr-[9.5rem] flex gap-5'>
          <Bookmark className='text-gray-500 size-5' />
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className='cursor-pointer'>
              <Ellipsis className='text-gray-500 size-5' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='px-2 py-2 w-44'>
              <DropdownMenuItem className='font-medium text-gray-700 cursor-pointer '>
                <span>Follow author</span>
              </DropdownMenuItem>
              {isMod ? (
                <DropdownMenuItem
                  className='font-medium text-gray-700 cursor-pointer'
                  onClick={handleDeletePost}>
                  <span>Delete post</span>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
