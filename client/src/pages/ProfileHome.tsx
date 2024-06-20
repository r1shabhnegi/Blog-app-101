import { getUserPosts } from "@/api";
import PostCard from "@/components/PostCard";
import { useAppSelector } from "@/redux/hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";

type PostType = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  previewImage: string;
  readTime: number;
};

const ProfileHome = () => {
  const { userId } = useParams();
  const { numberOfPosts } = useAppSelector((state) => state.profile);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { data: userPosts, refetch } = useQuery({
    queryKey: ["userPosts", userId, page],
    queryFn: () => getUserPosts({ userId, page }),
  });

  useEffect(() => {
    if (userPosts) {
      setPosts((prevPosts) => [...prevPosts, ...userPosts]);
    }
  }, [userPosts]);

  const fetchMorePosts = () => {
    if (+numberOfPosts > posts.length) {
      setPage((prev) => prev + 1);
      refetch();
    } else {
      setHasMore(false);
    }
  };

  return (
    <div>
      <InfiniteScroll
        className='flex flex-col items-center justify-center'
        dataLength={posts.length}
        hasMore={hasMore}
        loader={"...loading"}
        next={fetchMorePosts}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            postData={post}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};
export default ProfileHome;
