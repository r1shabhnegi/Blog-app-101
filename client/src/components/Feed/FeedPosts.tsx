import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback, FC } from "react";
import { followingPosts, latestPosts, tagPosts } from "@/api/postApi";
import PostCard from "../Post/PostCard";
import { PostType } from "@/lib/types";
import Spinner from "../Spinner";

interface props {
  currentTab: string;
}

const FeedPosts: FC<props> = ({ currentTab }) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPostsPage = async (
    cursor: string | null
  ): Promise<{ nextCursor: string | null; posts: PostType[] }> => {
    const cleanTag =
      currentTab === "/"
        ? "/"
        : currentTab === "/following"
        ? "/following"
        : currentTab.slice(1);

    switch (cleanTag) {
      case "/":
        return latestPosts(cursor);
      case "/following":
        return followingPosts(cursor);
      default:
        return tagPosts(cursor, cleanTag);
    }
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", currentTab],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      fetchPostsPage(pageParam),
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
    <div>
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
  );
};
export default FeedPosts;
