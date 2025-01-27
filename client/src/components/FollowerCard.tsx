import { GetFollowersType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkFollow, followAndUnFollow } from "@/api";
import { useNavigate } from "react-router-dom";

const FollowerCard = ({ followerData }: { followerData: GetFollowersType }) => {
  const clientQuery = useQueryClient();
  const navigate = useNavigate();

  const { data: followingStatus } = useQuery({
    queryKey: ["checkFollow", followerData?.id],
    queryFn: () => checkFollow(followerData?.id),
  });

  const { mutateAsync: followUnFollowMutate } = useMutation({
    mutationFn: followAndUnFollow,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["checkFollow"],
      });
    },
  });

  const handleFollowUser = () => {
    followUnFollowMutate(followerData?.id);
  };

  const name = followerData.name
    ? `${followerData.name.charAt(0).toUpperCase()}${followerData.name.slice(
        1
      )}`
    : "";
  return (
    <div
      key={followerData.id}
      className='flex items-center justify-between w-full my-3'>
      <span className='flex items-center justify-center gap-5'>
        <Avatar
          className='cursor-pointer size-12'
          onClick={() => navigate(`/profile/${followerData.id}`)}>
          <AvatarImage
            src={followerData.avatar}
            alt=''
          />
          <AvatarFallback>
            <img
              src={profileDemo}
              alt=''
            />
          </AvatarFallback>
        </Avatar>
        <span
          className='flex flex-col justify-center cursor-pointer'
          onClick={() => navigate(`/profile/${followerData.id}`)}>
          <p className='font-semibold'>{name}</p>
          <p className='text-xs font-medium text-gray-500 line-clamp-2 '>
            {followerData.bio}
          </p>
        </span>
      </span>
      <button
        className={`${
          followingStatus
            ? "text-green-600 border-[0.09rem] border-green-600"
            : "text-white bg-green-700 "
        } ml-8 text-xs px-2.5 h-min py-1.5 font-medium rounded-full`}
        onClick={handleFollowUser}>
        {followingStatus ? "Following" : "Follow"}
      </button>
    </div>
  );
};
export default FollowerCard;
