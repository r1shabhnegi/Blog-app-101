import {
  bookmark,
  getPost,
  isBookmarked,
  likePost,
  postStats,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import profileDemo from "@/assets/profileImg.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { multiFormatDateString } from "@/lib/checkData";
import { Bookmark, BookmarkCheck, Dot, HandHeart, Link } from "lucide-react";
import Comments from "@/components/Comments";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import SummaryAi from "@/components/SummaryAi";

const PostDetail = () => {
  const [summaryModal, setSummaryModal] = useState(false);
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
  });

  const { data: isBookmark } = useQuery({
    queryKey: ["check-bookmark", data?.id],
    queryFn: () => isBookmarked(data?.id),
    enabled: !!data?.id,
  });
  const { data: postStatsData } = useQuery({
    queryKey: ["postStats", postId],
    queryFn: () => postStats(postId),
    enabled: !!postId,
  });

  const { mutateAsync: BookmarkMutate } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-bookmark"] });
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const createdAt = multiFormatDateString(data?.createdAt);
  const authorName = data?.authorName
    ? `${data?.authorName.charAt(0).toUpperCase()}${data?.authorName.slice(1)}`
    : "";

  const handleBookmark = async () => {
    await BookmarkMutate(data?.id);
  };

  const { mutateAsync: likePostMutate } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postStats"] });
    },
  });

  const handleLikedBtn = async () => {
    await likePostMutate(postId);
  };

  if (isPending) return <Spinner />;

  return (
    <div className='max-w-[45rem] px-3 mx-auto w-full lg:p-0'>
      <div className='my-14'>
        <div className='text-xl font-bold sm:text-3xl md:text-4xl'>
          {data?.title}
        </div>
        <div className='flex gap-4 py-8 border-b'>
          <Avatar className='cursor-pointer sm:size-11 size-9 md:size-12'>
            <AvatarImage
              src={data?.authorAvatar}
              alt=''
            />
            <AvatarFallback>
              <img
                src={profileDemo}
                alt=''
              />
            </AvatarFallback>
          </Avatar>

          <span className='flex flex-col justify-center'>
            <p className='text-sm font-semibold text-gray-700 sm:text-base'>
              {authorName}
            </p>
            <span className='flex'>
              <p className='text-xs font-medium text-gray-600 sm:text-sm'>
                {data?.readTime} min read
              </p>
              <Dot className='text-gray-600 size-5' />
              <p className='text-xs font-medium text-gray-600 sm:text-sm'>
                {createdAt}
              </p>
              <Dot className='text-gray-600 size-5' />
              <p
                className='px-2 text-xs sm:text-sm flex justify-center items-center sm:pb-0.5 font-medium text-gray-600 bg-gray-200 rounded-full cursor-pointer'
                onClick={() => navigate(`/tag/${data?.tag}`)}>
                {data?.tag}
              </p>
            </span>
          </span>
        </div>

        <div className='flex items-center justify-between border-b'>
          <span className='flex items-center gap-2 py-2 '>
            <span className='flex gap-4'>
              <span
                className='flex items-center gap-2'
                onClick={handleLikedBtn}>
                <HandHeart className='text-gray-500 cursor-pointer size-6 sm:size-7' />
                <p className='text-base text-gray-400 sm:text-xl'>
                  {postStatsData?.totalClaps}
                </p>
              </span>

              <Comments totalComments={postStatsData?.totalComments || 0} />
            </span>
          </span>
          <span className='flex items-center gap-4 sm:gap-6'>
            <button
              className=' text-[12px] sm:text-[14px] font-medium bg-gradient-to-r from-pink-500 to-purple-700  rounded-full  px-1.5 sm:px-2.5 text-white sm:py-1 py-0.5'
              onClick={() => setSummaryModal(!summaryModal)}>
              AI summary
            </button>
            <button
              className=''
              onClick={handleBookmark}>
              {isBookmark ? (
                <BookmarkCheck className='text-gray-500 fill-gray-500 size-5 sm:size-6' />
              ) : (
                <Bookmark className='text-gray-500 size-5 sm:size-6' />
              )}
            </button>
            <Link className='text-gray-500 size-5 sm:size-6' />
          </span>
        </div>

        <div className='pt-16'>
          <img
            src={data?.previewImage}
            alt=''
            className='rounded-lg'
          />
        </div>

        <div
          className='pt-10 tiptap-detail htmlContentDetail'
          dangerouslySetInnerHTML={{ __html: data?.content }}></div>
      </div>

      <div className='flex items-center justify-between border-b'>
        <span className='flex items-center gap-2 py-2 '>
          <span className='flex gap-4'>
            <span
              className='flex items-center gap-2'
              onClick={handleLikedBtn}>
              <HandHeart className='text-gray-500 cursor-pointer size-6 sm:size-7' />
              <p className='text-base text-gray-400 sm:text-xl'>
                {postStatsData?.totalClaps}
              </p>
            </span>

            <Comments totalComments={postStatsData?.totalComments || 0} />
          </span>
        </span>
        <span className='flex items-center gap-4 sm:gap-6'>
          <button
            className=' text-[12px] sm:text-[14px] font-medium bg-gradient-to-r from-pink-500 to-purple-700  rounded-full  px-1.5 sm:px-2.5 text-white sm:py-1 py-0.5'
            onClick={() => setSummaryModal(!summaryModal)}>
            AI summary
          </button>
          <button
            className=''
            onClick={handleBookmark}>
            {isBookmark ? (
              <BookmarkCheck className='text-gray-500 fill-gray-500 size-5 sm:size-6' />
            ) : (
              <Bookmark className='text-gray-500 size-5 sm:size-6' />
            )}
          </button>
          <Link className='text-gray-500 size-5 sm:size-6' />
        </span>
      </div>
      {summaryModal ? (
        <SummaryAi
          cancel={() => setSummaryModal(!summaryModal)}
          content={data?.content}
        />
      ) : null}
    </div>
  );
};
export default PostDetail;
