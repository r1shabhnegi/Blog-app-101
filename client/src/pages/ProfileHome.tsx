import { getUserPosts } from "@/api";
import PostCard from "@/components/PostCard";
import { PostType } from "@/lib/types";
import { useAppSelector } from "@/redux/hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";

const ProfileHome = () => {
  const { userId } = useParams();
  const { numberOfPosts } = useAppSelector((state) => state.profile);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: userPosts, refetch } = useQuery({
    queryKey: ["userPosts", userId, page],
    queryFn: () => getUserPosts({ userId, page }),
    enabled: !!userId,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (userPosts) {
      setPosts((prevPosts) => [...prevPosts, ...userPosts]);
    }
  }, [userPosts]);

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    if (+numberOfPosts > posts.length) {
      refetch();
    } else {
      setHasMore(false);
    }
  };

  if (numberOfPosts == 0)
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
          postData={post}
          key={post.id}
        />
      ))}
    </InfiniteScroll>
  );
};
export default ProfileHome;
