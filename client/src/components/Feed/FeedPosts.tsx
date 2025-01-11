import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useRef, useCallback, FC } from "react";
import { followingPosts, latestPosts, tagPosts } from "@/api/postApi";

interface Post {
  id: string;
  title: string;
  content: string;
}

const fetchPostsPage = async (tag: string, cursor: string | null) => {
  const cleanTag = tag.replace("/", "");

  if (cleanTag === "") {
    const res = await latestPosts(cursor);
    console.log(res);
    return res.data;
  }

  if (cleanTag === "following") {
    const res = await followingPosts(cursor);
    return res.data;
  }

  if (cleanTag !== "following" && cleanTag !== "") {
    const res = await tagPosts(cursor, cleanTag);
    return res.data;
  }
};

interface props {
  currentTab: string;
}

const FeedPosts: FC<props> = ({ currentTab }) => {
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
    queryKey: ["posts", currentTab],
    queryFn: ({ pageParam }) => fetchPostsPage(currentTab, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1 * 60 * 1000, // Data becomes stale after 1 minute
    // Cache is kept for 5 minutes
    refetchOnMount: "always", // Always refetch first page when component mounts
    initialPageParam: null,
  });

  // Intersection Observer for infinite scrolling
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

  // Effect to refetch when tab changes
  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo(0, 0);
    // Refetch the first page
    refetch();
  }, [currentTab, refetch]);

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        Error loading posts. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {data}
        {/* {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className='p-4'>
            <Skeleton className='w-3/4 h-4 mb-2' />
            <Skeleton className='w-full h-20' />
          </Card>
        ))} */}
      </div>
    );
  }

  ///////////////////////////////////////////////////

  return <div>sds</div>;
};

export default FeedPosts;
