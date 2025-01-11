import { useInfiniteQuery } from "@tanstack/react-query";
// import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useRef, useCallback } from "react";
import { latestPosts } from "@/api/postApi";
import PostCard from "../PostCard";
import { PostType } from "@/lib/types";

const FeedLatest = () => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["feedLatest"],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      latestPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1 * 60 * 1000,
    refetchOnMount: "always",
    initialPageParam: null,
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

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        Error loading posts. Please try again later.
      </div>
    );
  }

  if (isLoading) return;

  return (
    <div className='relative'>
      <div className='flex flex-col items-center justify-center overflow-y-hidden'>
        {data?.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page?.result.map((post: PostType) => (
              <PostCard
                key={post.id}
                postData={post}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        ref={observerTarget}
        className='absolute h-[50rem] bottom-[25rem]'
      />
    </div>
  );
};

export default FeedLatest;
