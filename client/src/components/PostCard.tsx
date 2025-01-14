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
import { bookmark } from "@/api";
import { postStats } from "@/api/postApi";
import { addHistory } from "@/api/userApi";
import PostCardDropdown from "./PostCardDropdown";
import { useEffect, useState } from "react";
const PostCard = ({ postData }: { postData: PostType }) => {
  const navigate = useNavigate();

  const [isBookmark, setIsBookmark] = useState<boolean>(false);

  const { userId } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const isMod: boolean = postData?.authorId === userId ? true : false;

  const { data: postStatsData } = useQuery({
    queryKey: ["postStats", postData?.id],
    queryFn: () => postStats(postData?.id),
    enabled: !!postData?.id,
  });

  useEffect(() => {
    if (postStatsData)
      if ("isSavedByUser" in postStatsData) {
        setIsBookmark(postStatsData?.isSavedByUser);
      }
  }, [postStatsData]);

  const { mutateAsync: BookmarkMutate } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-bookmark"],
      });
    },
  });

  const { mutateAsync: readingHistoryMutate } = useMutation({
    mutationFn: addHistory,
  });

  const authorName = postData.authorName
    ? `${postData.authorName
        .charAt(0)
        .toUpperCase()}${postData.authorName.slice(1)}`
    : "";
  const createdAt = multiFormatDateString(postData.createdAt);

  const handleBookmark = async () => {
    setIsBookmark(!isBookmark);
    await BookmarkMutate(postData.id);
  };

  const handleClickCard = async () => {
    navigate(`/post/${postData?.id}`);
    await readingHistoryMutate({ postId: postData.id });
  };

  return (
    <div className='w-[21rem] sm:w-[40rem] md:w-[46rem] lg:w-[43rem] xl:w-[45rem] flex flex-col justify-center gap-2 items-center mb-2 mt-8 border-b border-[#e8e8e8]'>
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
            <p className='text-xs font-medium text-gray-800 cursor-pointer hover:underline md:text-sm'>
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
            postId={postData.id}
          />
        </span>
      </div>

      <div
        className='flex items-center justify-between w-full cursor-pointer gap-7 md:flex-row md:gap-0'
        onClick={handleClickCard}>
        <div className='flex flex-col gap-2 text-left w-[29rem] md:w-[33rem] lg:w-[30rem] xl:w-[32rem]'>
          <span className='font-bold tracking-tighter text-gray-900 line-clamp-3 text-md md:text-[1.4rem] leading-tight'>
            {postData.title}
          </span>
          <span
            className='text-xs font-medium tracking-tighter text-gray-500 md:text-base line-clamp-2 htmlContentCard post-card-content'
            dangerouslySetInnerHTML={{ __html: postData.content }}></span>
        </div>
        {postData.previewImage && (
          <div className='size-5/12 sm:size-1/5  md:w-[10.5rem] md:h-[7rem] '>
            <img
              src={postData.previewImage}
              alt='preview image'
              className='object-cover w-full h-full rounded'
            />
          </div>
        )}
      </div>

      <div className='flex items-center justify-between w-full my-8 '>
        <div className='flex items-center gap-2 cursor-pointer'>
          <p
            className='pb-1 px-2.5 pt-0.5 text-[10px] md:text-xs font-medium text-center text-gray-900 cursor-pointer bg-gray-200 rounded-full '
            onClick={() => navigate(`/tag/${postData.tag}`)}>
            {postData.tag}
          </p>

          <p
            className='pb-1 px-2.5 pt-0.5 text-[10px] md:text-xs font-medium text-center text-gray-600'
            onClick={handleClickCard}>
            {postData.readTime} min read
          </p>
          <span
            onClick={handleClickCard}
            className='flex gap-4'>
            <span className='flex items-center gap-1'>
              <HandHeart className='text-gray-500 cursor-pointer size-4 md:size-5' />
              <p className='text-gray-400'>{postStatsData?.totalClaps}</p>
            </span>
            <span className='flex items-center gap-1'>
              <MessageCircle className='text-gray-500 cursor-pointer size-3 md:size-4' />
              <p className='text-gray-400'>{postStatsData?.totalComments}</p>
            </span>
          </span>
        </div>

        <div className='md:mr-[12rem] flex gap-5'>
          <button
            className=''
            onClick={handleBookmark}>
            {isBookmark ? (
              <BookmarkCheck className='text-gray-500 fill-gray-500 size-4 md:size-5' />
            ) : (
              <Bookmark className='text-gray-500 size-4 md:size-5' />
            )}
          </button>
          <span className='hidden md:block'>
            <PostCardDropdown
              authorId={postData.authorId}
              isMod={isMod}
              postId={postData.id}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
