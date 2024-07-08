import { allLatestPost } from "@/api";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { PostType } from "@/lib/types";
import { useAppSelector } from "@/redux/hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const HomeLatest = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { totalPostsCount } = useAppSelector((state) => state.auth);
  const { data, refetch } = useQuery({
    queryKey: ["latestPosts", page],
    queryFn: () => allLatestPost(`${page}`),
  });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (data) {
      setPosts((prevPosts) => [...prevPosts, ...data]);
    }
  }, [data]);

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    if (totalPostsCount > posts.length) {
      refetch();
    } else {
      setHasMore(false);
    }
  };

  if (totalPostsCount == 0)
    return <p className='text-2xl font-semibold text-gray-500'>No posts</p>;

  return (
    <InfiniteScroll
      className='flex flex-col items-center justify-center'
      dataLength={posts.length}
      hasMore={hasMore}
      loader={<Spinner />}
      next={fetchMorePosts}>
      {posts.map((post: PostType) => (
        <PostCard
          key={post.id}
          postData={post}
        />
      ))}
      {posts.map((post: PostType) => (
        <PostCard
          key={post.id}
          postData={post}
        />
      ))}
      {posts.map((post: PostType) => (
        <PostCard
          key={post.id}
          postData={post}
        />
      ))}
    </InfiniteScroll>
  );
};
export default HomeLatest;
