import { getTag } from "@/api";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { PostType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams, useSearchParams } from "react-router-dom";

const Tag = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const { name } = useParams();

  const tagName = name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : "";

  const { data, isPending, refetch } = useQuery({
    queryKey: ["tag", tagName, page],
    queryFn: () => getTag({ name, page }),
  });

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  console.log(data?.posts);
  useEffect(() => {
    if (data) {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.countTagPosts) {
      setNumberOfPosts(data.countTagPosts);
    }
  }, [data]);

  if (isPending) return <Spinner />;
  console.log(data);
  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    if (numberOfPosts > posts.length) {
      refetch();
    } else {
      setHasMore(false);
    }
  };

  return (
    <div className='bg-red-5 w-full max-w-[60rem] mx-auto'>
      <div className='flex flex-col items-center justify-center py-20 bordr-b'>
        <h1 className='text-5xl font-semibold text-gray-800'>{tagName}</h1>
        <h1 className='text-2xl text-gray-600'>
          {numberOfPosts}
          {numberOfPosts === 1 ? "Post" : "Posts"}
        </h1>
      </div>
      <div className='px-36'>
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
    </div>
  );
};
export default Tag;
