import { getHistoryPost } from "@/api";
import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";

import PostCard from "@/components/PostCard";
import { useEffect } from "react";

const ReadingHistory = () => {
  const { data: historyPosts, isPending } = useQuery({
    queryKey: ["getHistoryPosts"],
    queryFn: getHistoryPost,
    gcTime: 0,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return isPending ? (
    <Spinner />
  ) : (
    <div>
      <div>
        <h1 className='my-16 text-5xl font-semibold'>Reading History</h1>
      </div>
      <div>
        {historyPosts?.map((postData) => (
          <PostCard
            postData={postData}
            key={postData.id + Math.random() * 10 + Math.random()}
          />
        ))}
      </div>
    </div>
  );
};
export default ReadingHistory;
