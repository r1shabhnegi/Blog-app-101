import { getFollowers } from "@/api";
import Spinner from "@/components/Spinner";
import { GetFollowersType } from "@/lib/types";
import { useAppSelector } from "@/redux/hook";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";

import FollowerCard from "@/components/FollowerCard";

const Followers = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [followersData, setFollowersData] = useState<GetFollowersType[]>([]);
  const { totalFollowers: numberOfFollowers } = useAppSelector(
    (state) => state.profile
  );
  const { userId } = useParams();

  const { data, isPending, refetch } = useQuery({
    queryKey: ["getFollowers", page, userId],
    queryFn: () => getFollowers({ userId, page }),
    gcTime: 0,
  });

  useEffect(() => {
    setPage(1);
    setFollowersData([]);
    setHasMore(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useMemo(() => {
    if (data) {
      setFollowersData((prevData) => [...prevData, ...data]);
    }
  }, [data]);

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    if (numberOfFollowers > followersData.length) {
      refetch();
    } else {
      setHasMore(false);
    }
  };

  return isPending ? (
    <Spinner />
  ) : numberOfFollowers !== 0 ? (
    <div>
      <div className='my-10 text-5xl font-semibold text-gray-800'>
        {numberOfFollowers} {numberOfFollowers > 1 ? "Followers" : "Follower"}
      </div>

      <InfiniteScroll
        className='flex flex-col items-center justify-center'
        dataLength={followersData.length}
        hasMore={hasMore}
        loader={<Spinner />}
        next={fetchMorePosts}>
        {followersData.map((followerData: GetFollowersType) => (
          <FollowerCard
            key={followerData.id}
            followerData={followerData}
          />
        ))}
      </InfiniteScroll>
    </div>
  ) : (
    <p className='text-2xl font-semibold text-gray-500'>No Followers</p>
  );
};
export default Followers;
