import { getUserPosts } from "@/api";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { useAppSelector } from "@/redux/hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
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
    // setPage(1);
    // setPosts([]);
    // setHasMore(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const {
    data: userPosts,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["userPosts", userId, page],
    queryFn: () => getUserPosts({ userId, page }),
  });

  useMemo(() => {
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

  // if (isPending) return <Spinner />;

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
            key={post.id}
            postData={post}
          />
        ))}
      </InfiniteScroll>
    </div>
  ) : (
    <p className='text-2xl font-semibold text-gray-500'>No posts</p>
  );
};
export default ProfileHome;
