import { getSavedPosts } from "@/api";
import PostCard from "@/components/PostCard";
import { PostType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ProfileLists = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, refetch } = useQuery({
    queryKey: ["savedPosts", page],
    queryFn: () => getSavedPosts(page),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (data) {
      setTotalPostsCount(data.countSaved);
      setPosts((prev) => [...prev, ...data.savedPosts]);
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
      loader={"Loading..."}
      next={fetchMorePosts}>
      {posts.map((post: PostType) => (
        <PostCard
          key={post.id}
          postData={post}
        />
      ))}
    </InfiniteScroll>
  );
};
export default ProfileLists;
