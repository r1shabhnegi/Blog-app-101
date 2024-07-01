import { countHistoryPost, getHistoryPost } from "@/api";
import Spinner from "@/components/Spinner";
import { useAppSelector } from "@/redux/hook";
import { useQuery } from "@tanstack/react-query";

import PostCard from "@/components/PostCard";
import { PostType } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ReadingHistory = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [numberOfPosts, SetNumberOfPosts] = useState<number>(0);

  // const { userId } = useAppSelector((state) => state.auth);

  const { data: countHistoryPosts } = useQuery({
    queryKey: ["countHistoryPost"],
    queryFn: countHistoryPost,
  });

  useEffect(() => {
    if (countHistoryPosts) {
      SetNumberOfPosts(+countHistoryPosts.count);
    }
  }, [countHistoryPosts]);

  console.log(numberOfPosts);

  const {
    data: historyPosts,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["getHistoryPosts", page],
    queryFn: () => getHistoryPost(page),
    gcTime: 0,
  });

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useMemo(() => {
    if (historyPosts) {
      setPosts((prevPosts) => [...prevPosts, ...historyPosts]);
    }
  }, [historyPosts]);

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    if (+numberOfPosts > posts.length) {
      refetch();
    } else {
      setHasMore(false);
    }
  };

  return isPending ? (
    <Spinner />
  ) : +numberOfPosts !== 0 ? (
    <div>
      <InfiniteScroll
        className='flex flex-col items-center justify-center'
        dataLength={posts.length}
        hasMore={hasMore}
        loader={<Spinner />}
        next={fetchMorePosts}>
        {posts.map((post: PostType) => (
          <PostCard
            postData={post}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
    </div>
  ) : (
    <p className='text-2xl font-semibold text-gray-500'>No posts</p>
  );
};
export default ReadingHistory;
