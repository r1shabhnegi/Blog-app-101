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
    <div>
      <div className='max-w-full w-full px-4 sm:px-0 sm:max-w-[40rem] md:max-w-[46rem] lg:max-w-[43rem] xl:max-w-[45rem] flex flex-col gap-4 py-6 border-b border-gray-200'>
        {/* Author Info Section */}
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <div
              className='flex items-center gap-2 cursor-pointer'
              onClick={() => navigate(`/profile/${postData?.authorId}`)}>
              <Avatar className='size-6 md:size-7'>
                <AvatarImage
                  src={postData?.authorAvatar}
                  alt={authorName}
                />
                <AvatarFallback>
                  <img
                    src={profileDemo}
                    alt={authorName}
                  />
                </AvatarFallback>
              </Avatar>
              <p className='text-xs md:text-sm font-medium text-gray-800 hover:underline truncate max-w-[150px]'>
                {authorName}
              </p>
            </div>
            <Dot className='text-gray-600 size-4' />
            <p className='text-[10px] sm:text-xs font-medium text-gray-800 truncate'>
              {createdAt}
            </p>
          </div>
          <div className='md:hidden'>
            <PostCardDropdown
              authorId={postData.authorId}
              isMod={isMod}
              postId={postData.id}
            />
          </div>
        </div>

        {/* Content Section */}
        <div
          className='flex cursor-pointer group'
          onClick={handleClickCard}>
          <div className='flex-1 w-20'>
            <h2 className='mb-2 text-base font-bold tracking-tight text-gray-900 md:text-xl line-clamp-3'>
              {postData.title}
            </h2>
            <div
              className='overflow-hidden text-xs text-gray-500 md:text-sm line-clamp-2'
              dangerouslySetInnerHTML={{ __html: postData.content }}></div>
          </div>

          {postData.previewImage && (
            <div className='flex-shrink-0 w-16 h-16 ml-3 lg:ml-10 sm:ml-5 sm:w-20 sm:h-20 md:w-32 md:h-24 lg:w-40 lg:h-28'>
              <img
                src={postData.previewImage}
                alt='Preview'
                className='object-cover w-full h-full rounded-lg'
              />
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tag/${postData.tag}`);
              }}
              className='px-3 py-1 text-xs font-medium text-gray-900 bg-gray-200 rounded-full hover:bg-gray-300'>
              {postData.tag}
            </span>

            <span className='text-xs text-gray-600'>
              {postData.readTime} min read
            </span>

            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-1'>
                <HandHeart className='text-gray-500 size-4' />
                <span className='text-xs text-gray-500'>
                  {postStatsData?.totalClaps}
                </span>
              </span>
              <span className='flex items-center gap-1'>
                <MessageCircle className='text-gray-500 size-4' />
                <span className='text-xs text-gray-500'>
                  {postStatsData?.totalComments}
                </span>
              </span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              className='hover:text-gray-700'>
              {isBookmark ? (
                <BookmarkCheck className='text-gray-500 fill-gray-500 size-4 md:size-5' />
              ) : (
                <Bookmark className='text-gray-500 size-4 md:size-5' />
              )}
            </button>
            <div className='hidden md:block'>
              <PostCardDropdown
                authorId={postData.authorId}
                isMod={isMod}
                postId={postData.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
