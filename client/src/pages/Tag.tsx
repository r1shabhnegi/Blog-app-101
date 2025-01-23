import { checkTagFollow, followTag, getTagDetail } from "@/api/tagApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { getTagPagePosts } from "@/api/postApi";
import PostCard from "@/components/Post/PostCard";
import Spinner from "@/components/Spinner";
import { PostType } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const Tag = () => {
  const [isFollow, setIsFollow] = useState(false);
  const queryClient = useQueryClient();
  const { name } = useParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data: tagBasicDetail } = useQuery({
    queryKey: ["tagDetail"],
    queryFn: () => getTagDetail(name || ""),
    enabled: !!name,
  });

  const {
    data: followData,
    isSuccess,
    isLoading: followingDataLoading,
  } = useQuery({
    queryKey: ["checkTagFollow", tagBasicDetail?.id],
    queryFn: () => checkTagFollow(tagBasicDetail?.id || ""),
    enabled: !!tagBasicDetail?.id,
  });

  useEffect(() => {
    if (isSuccess && followData) {
      setIsFollow(followData.isFollow);
    }
  }, [isSuccess, followData]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tagPagePosts", tagBasicDetail?.id],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getTagPagePosts(tagBasicDetail?.id, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1 * 60 * 1000,
    refetchOnMount: "always",
    initialPageParam: null,
    enabled: !!tagBasicDetail?.id,
  });
  console.log(data);
  const { mutateAsync } = useMutation({
    mutationKey: ["followTag", tagBasicDetail?.id],
    mutationFn: followTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkTagFollow", tagBasicDetail?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["tagSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["tagDetail"] });
    },
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  useEffect(() => {
    window.scrollTo(0, 0);
    refetch();
  }, [refetch]);

  const handleFollowTag = async (tagId: string) => {
    try {
      setIsFollow(!isFollow);
      await mutateAsync(tagId);
    } catch (error) {
      console.error("Error following/unfollowing tag:", error);
    }
  };

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        Error loading posts. Please try again later.
      </div>
    );
  }

  return (
    <div className='bg-red-5 w-full max-w-[60rem] mx-auto'>
      <div className='flex flex-col items-center justify-center gap-1 py-12 md:py-20'>
        <h1 className='text-4xl font-semibold text-gray-800 md:text-5xl'>
          {tagBasicDetail &&
            tagBasicDetail.name.split("")[0].toUpperCase() +
              tagBasicDetail.name.slice(1)}
        </h1>
        <p className='flex text-[11px] items-center sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-600'>
          {tagBasicDetail && tagBasicDetail._count.posts}
          {tagBasicDetail && tagBasicDetail?._count.posts > 1
            ? " Posts"
            : " Post"}
          <Dot className='text-gray-500 size-3 md:size-4' />
          {tagBasicDetail && tagBasicDetail._count.followers}
          {tagBasicDetail && tagBasicDetail?._count.followers > 1
            ? " Followers"
            : " Follower"}
        </p>
        {!followingDataLoading && (
          <>
            {isFollow ? (
              <span
                className='text-[10px] cursor-pointer md:text-[11px] lg:text-[12px] rounded-full px-2 py-0.5 border-[0.1rem] border-gray-700'
                onClick={() => handleFollowTag(tagBasicDetail?.id || "")}>
                Following
              </span>
            ) : (
              <span
                className='bg-gray-800 cursor-pointer text-[10px] md:text-[11px] lg:text-[12px]  text-white rounded-full px-2 py-0.5'
                onClick={() => handleFollowTag(tagBasicDetail?.id || "")}>
                Follow
              </span>
            )}
          </>
        )}
      </div>
      <div className='relative'>
        {data?.pages.map((page) =>
          page?.posts.map((post: PostType) => (
            <PostCard
              key={post.id + post.title}
              postData={post}
            />
          ))
        )}
        <div
          ref={observerTarget}
          className='absolute h-[50rem] bottom-[25rem]'
        />
        {isFetchingNextPage || (isLoading && <Spinner className='mt-40' />)}
      </div>
    </div>
  );
};
export default Tag;
