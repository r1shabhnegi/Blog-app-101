import { followingPosts } from "@/api";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { PostType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const HomeFollowing = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const { data: followingPostsData, refetch } = useQuery({
    queryKey: ["followingPosts", page],
    queryFn: () => followingPosts(page),
  });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (followingPostsData) {
      setPosts((prevPosts) => {
        const newPosts = followingPostsData.data.posts.filter(
          (newPost) =>
            !prevPosts.some((existingPost) => existingPost.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
      setTotalPostsCount(followingPostsData.data.numberOfPosts);
    }
  }, [followingPostsData]);

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
    </InfiniteScroll>
  );
};
export default HomeFollowing;
