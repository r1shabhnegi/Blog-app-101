import { useInfiniteQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useCallback } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  // Add other post properties as needed
}

interface PageData {
  posts: Post[];
  nextCursor: string | null;
}

// Function to fetch posts based on tag and cursor
const fetchPostsPage = async (
  tag: string,
  cursor: string | null
): Promise<PageData> => {
  const cleanTag = tag.replace("/", "");
  let url = `/api/posts?cursor=${cursor || ""}`;

  if (cleanTag === "following") {
    url = `/api/posts/following?cursor=${cursor || ""}`;
  } else if (cleanTag !== "") {
    url = `/api/posts/tag/${cleanTag}?cursor=${cursor || ""}`;
  }

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

interface FeedPostsProps {
  currentTab: string;
}

const FeedPosts = ({ currentTab }: FeedPostsProps) => {
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
    cacheTime: 5 * 60 * 1000, // Cache is kept for 5 minutes
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
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className='p-4'>
            <Skeleton className='w-3/4 h-4 mb-2' />
            <Skeleton className='w-full h-20' />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {data?.pages.map((page, i) => (
        <div
          key={i}
          className='space-y-4'>
          {page.posts.map((post) => (
            <Card
              key={post.id}
              className='p-4'>
              <h3 className='mb-2 font-semibold'>{post.title}</h3>
              <p>{post.content}</p>
            </Card>
          ))}
        </div>
      ))}

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <Card className='p-4'>
          <Skeleton className='w-3/4 h-4 mb-2' />
          <Skeleton className='w-full h-20' />
        </Card>
      )}

      {/* Intersection observer target */}
      <div
        ref={observerTarget}
        className='h-4'
      />
    </div>
  );
};

export default FeedPosts;
