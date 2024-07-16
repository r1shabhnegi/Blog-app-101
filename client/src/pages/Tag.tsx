import { getTag } from "@/api";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { PostType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";

const Tag = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const { name } = useParams();

  const tagName = name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : "";

  const { data, refetch } = useQuery({
    queryKey: ["tag", tagName, page],
    queryFn: () => getTag({ name, page }),
  });

  useEffect(() => {
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
      <div className='flex flex-col items-center justify-center py-12 md:py-20'>
        <h1 className='text-4xl font-semibold text-gray-800 md:text-5xl'>
          {tagName}
        </h1>
        <h1 className='text-xl text-gray-600 md:text-2xl'>
          {numberOfPosts}
          {numberOfPosts === 1 ? "Post" : "Posts"}
        </h1>
      </div>
      <div className='lg:px-36'>
        {numberOfPosts !== 0 ? (
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
        ) : (
          <p className='text-2xl font-semibold text-center text-gray-500'>
            There is no posts for this topic
          </p>
        )}
      </div>
    </div>
  );
};
export default Tag;
