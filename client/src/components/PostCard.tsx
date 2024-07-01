import { PostType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileDemo from "@/assets/profileImg.png";
import { useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/checkData";
import { Bookmark, BookmarkCheck, Dot } from "lucide-react";
import { useAppSelector } from "@/redux/hook";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReadingHistory, bookmark, deletePost, isBookmarked } from "@/api";
import { useToast } from "./ui/use-toast";
import PostCardDropdown from "./PostCardDropdown";
const PostCard = ({ postData }: { postData: PostType }) => {
  const navigate = useNavigate();

  const { userId } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMod: boolean = postData?.authorId === userId ? true : false;

  const { data: isBookmark } = useQuery({
    queryKey: ["check-bookmark", postData?.id],
    queryFn: () => isBookmarked(postData?.id),
  });
  const { mutateAsync: deletePostAsync } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast({ title: "Post deleted", className: "bg-green-400" });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
  const { mutateAsync: BookmarkMutate } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-bookmark"] });
    },
  });
  const { mutateAsync: readingHistoryMutate } = useMutation({
    mutationFn: addReadingHistory,
  });

  const authorName = postData.authorName
    ? `${postData.authorName
        .charAt(0)
        .toUpperCase()}${postData.authorName.slice(1)}`
    : "";

  const createdAt = multiFormatDateString(postData.createdAt);

  const handleDeletePost = async () => {
    await deletePostAsync(postData.id);
  };
  const handleBookmark = async () => {
    await BookmarkMutate(postData.id);
  };

  const handleClickCard = async () => {
    navigate(`/post/${postData?.id}`);
    await readingHistoryMutate({ postId: postData.id });
  };
  return (
    <div className='flex flex-col items-start w-full my-2 mt-8 border-b border-gray-300'>
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
          <p className='text-sm font-medium text-gray-800 cursor-pointer'>
            {authorName}
          </p>
        </span>
        <Dot className='text-gray-600 size-5' />
        <p className='text-sm font-medium text-gray-800'>{createdAt}</p>
      </div>

      <div
        className='flex items-center justify-between w-full cursor-pointer'
        onClick={handleClickCard}>
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

      <div className='flex items-center justify-between w-full my-8 '>
        <div
          className='flex gap-2 cursor-pointer'
          onClick={handleClickCard}>
          <p className='pb-1 px-2.5 pt-0.5 text-xs font-medium text-center text-gray-900 bg-gray-200 rounded-full '>
            {postData.tag}
          </p>

          <p className='pb-1 px-2.5 pt-0.5 text-xs font-medium text-center text-gray-600'>
            {postData.readTime} min read
          </p>
        </div>

        <div className='mr-[9.5rem] flex gap-5'>
          <button
            className=''
            onClick={handleBookmark}>
            {isBookmark ? (
              <BookmarkCheck className='text-gray-500 size-5' />
            ) : (
              <Bookmark className='text-gray-500 size-5' />
            )}
          </button>
          <PostCardDropdown
            isMod={isMod}
            handleDeletePost={() => handleDeletePost()}
          />
        </div>
      </div>
    </div>
  );
};
export default PostCard;
