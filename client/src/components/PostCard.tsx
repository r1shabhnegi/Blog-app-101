import { PostType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileDemo from "@/assets/profileImg.png";
import { useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/checkData";
import {
  Bookmark,
  BookmarkCheck,
  Dot,
  HandHeart,
  MessageCircle,
} from "lucide-react";
import { useAppSelector } from "@/redux/hook";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addReadingHistory,
  bookmark,
  deletePost,
  isBookmarked,
  postStats,
} from "@/api";
import { useToast } from "./ui/use-toast";
import PostCardDropdown from "./PostCardDropdown";
import { useEffect, useState } from "react";
const PostCard = ({ postData }: { postData: PostType }) => {
  const navigate = useNavigate();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);

  const { userId } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMod: boolean = postData?.authorId === userId ? true : false;

  const { data: isBookmarkData, isSuccess: isSuccessBookmarkData } = useQuery({
    queryKey: ["check-bookmark", postData?.id],
    queryFn: () => isBookmarked(postData?.id),
    enabled: !!postData?.id,
  });
  useEffect(() => {
    if (isSuccessBookmarkData) {
      setIsBookmark(isBookmarkData);
    }
  }, [isBookmarkData, isSuccessBookmarkData]);
  const { data: postStatsData } = useQuery({
    queryKey: ["postStats", postData?.id],
    queryFn: () => postStats(postData?.id),
    enabled: !!postData?.id,
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
      queryClient.invalidateQueries({
        queryKey: ["check-bookmark"],
      });
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
    <div className='flex w-full flex-col justify-center gap-2 items-center mb-2 mt-8 border-b border-[#e8e8e8]'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center justify-start w-full gap-1 mb-1'>
          <div
            className='flex justify-center items-center gap-1.5 md:gap-2.5'
            onClick={() => navigate(`/profile/${postData?.authorId}`)}>
            <Avatar className='cursor-pointer size-6 md:size-7'>
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
            <p className='text-xs font-medium text-gray-800 cursor-pointer sm:text-sm'>
              {authorName}
            </p>
          </div>
          <Dot className='text-gray-600 size-5' />
          <p className='text-[10px] sm:text-xs font-medium text-gray-800'>
            {createdAt}
          </p>
        </div>
        <span className='md:hidden'>
          <PostCardDropdown
            authorId={postData.authorId}
            isMod={isMod}
            handleDeletePost={() => handleDeletePost()}
          />
        </span>
      </div>
      <div
        className='flex flex-col justify-center w-full cursor-pointer md:justify-between md:items-center gap-7 md:flex-row md:gap-0'
        onClick={handleClickCard}>
        <div className='flex flex-col w-full gap-2 text-wrap  text-left max-w-[28rem] sm:max-w-[29.5rem]'>
          <span className='font-bold text-gray-900 text-md lg:text-lg md:text-xl '>
            {postData.title}
          </span>
          <span
            className='text-xs font-medium text-gray-500 md:text-base line-clamp-2 htmlContentCard post-card-content'
            dangerouslySetInnerHTML={{ __html: postData.content }}></span>
        </div>
        {postData.previewImage && postData.previewImage !== "" ? (
          <img
            src={postData.previewImage}
            alt='Img'
            className='object-cover rounded-lg h-[10rem] md:h-[9rem] w-[20rem] sm:w-[27rem]  md:w-[9rem]'
          />
        ) : null}
      </div>

      <div className='flex items-center justify-between w-full my-8 '>
        <div className='flex items-center gap-2 cursor-pointer'>
          <p
            className='pb-1 px-2.5 pt-0.5 text-xs font-medium text-center text-gray-900 cursor-pointer bg-gray-200 rounded-full '
            onClick={() => navigate(`/tag/${postData.tag}`)}>
            {postData.tag}
          </p>

          <p
            className='pb-1 px-2.5 pt-0.5 text-xs font-medium text-center text-gray-600'
            onClick={handleClickCard}>
            {postData.readTime} min read
          </p>
          <span
            onClick={handleClickCard}
            className='flex gap-4'>
            <span className='flex items-center gap-1'>
              <HandHeart className='text-gray-500 cursor-pointer size-5' />
              <p className='text-gray-400'>{postStatsData?.totalClaps}</p>
            </span>
            <span className='flex items-center gap-1'>
              <MessageCircle className='text-gray-500 cursor-pointer size-4' />
              <p className='text-gray-400'>{postStatsData?.totalComments}</p>
            </span>
          </span>
        </div>

        <div className='md:mr-[12rem] flex gap-5'>
          <button
            className=''
            onClick={handleBookmark}>
            {isBookmark ? (
              <BookmarkCheck className='text-gray-500 fill-gray-500 size-5' />
            ) : (
              <Bookmark className='text-gray-500 size-5' />
            )}
          </button>
          <span className='hidden md:block'>
            <PostCardDropdown
              authorId={postData.authorId}
              isMod={isMod}
              handleDeletePost={() => handleDeletePost()}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
