import { getHistory } from "@/api/userApi";
import Spinner from "@/components/Spinner";
import { useQuery } from "@tanstack/react-query";

import PostCard from "@/components/PostCard";
import { useEffect } from "react";

const ReadingHistory = () => {
  const { data: historyPosts, isPending } = useQuery({
    queryKey: ["getHistoryPosts"],
    queryFn: getHistory,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return isPending ? (
    <Spinner />
  ) : (
    <div>
      <div className='flex flex-col items-center justify-center lg:items-start lg:justify-start'>
        <h1 className='m-0 my-16 text-3xl font-semibold md:text-4xl lg:ml-10 xl:m-0 lg:text-5xl'>
          Reading History
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
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
