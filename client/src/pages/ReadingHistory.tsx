import { getHistory } from "@/api/userApi";
import PostCard from "@/components/Post/PostCard";
import Spinner from "@/components/Spinner";
import { PostType } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

const ReadingHistory = () => {
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
    queryKey: ["savedPost"],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getHistory(pageParam),
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
  return (
    <div className='relative'>
      <div className='my-16'>
        <h1 className='text-2xl font-semibold tracking-tight text-center text-gray-800 lg:text-start sm:text-3xl md:text-4xl lg:text-5xl'>
          Reading History
        </h1>
      </div>
      {data?.pages.map((page) =>
        page?.posts?.map((post: PostType) => (
          <PostCard
            key={post.id + post.title + Math.random() * 9999}
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
  );
};
export default ReadingHistory;
