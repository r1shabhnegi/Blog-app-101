import { useAppDispatch, useAppSelector } from "@/redux/hook";

import profileDeno from "../assets/profileImg.png";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkFollow,
  fiveFollowing,
  followAndUnFollow,
  followerCount,
} from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { useEffect } from "react";
import { setFollowerCount } from "@/redux/profileSlice";

const ProfileSidebar = () => {
  const { name, avatar, bio } = useAppSelector((state) => state.profile);
  const { userId } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { userId: userIdParam } = useParams();
  const clientQuery = useQueryClient();
  const navigate = useNavigate();
  const isMod = userId === userIdParam ? true : false;

  const { data: followerCountData } = useQuery({
    queryKey: ["followerCount", userIdParam],
    queryFn: () => followerCount(userIdParam),
  });

  const { data: fiveFollowingData } = useQuery({
    queryKey: ["fiveFollowing", userIdParam],
    queryFn: () => fiveFollowing(userIdParam),
  });

  const { data: followingStatus } = useQuery({
    queryKey: ["checkFollow", userIdParam],
    queryFn: () => checkFollow(userIdParam),
    enabled: !isMod,
  });

  const { mutateAsync: followUnFollowMutate } = useMutation({
    mutationFn: followAndUnFollow,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["checkFollow"],
      });
    },
  });

  useEffect(() => {
    if (followerCountData) {
      dispatch(setFollowerCount(followerCountData?.followerCount));
    }
  }, [followerCountData, dispatch]);

  const adminName = name
    ? `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    : "";

  const handleEditBtn = () => {
    navigate("/settings", {
      state: {
        isOpenEditCard: true,
      },
    });
  };
  const profilePic = avatar && avatar.length > 5 ? avatar : profileDeno;

  console.log(fiveFollowingData?.length);

  const handleFollowBtn = async () => {
    await followUnFollowMutate(userIdParam);
  };

  return (
    <div className='flex flex-col'>
      <span className='flex flex-col justify-center w-24'>
        <img
          src={profilePic}
          alt='Avatar Image'
          className='object-cover rounded-full aspect-square'
        />
      </span>
      <h1 className='mt-4 text-lg font-semibold text-gray-800'>{adminName}</h1>

      <p
        className='my-2 font-medium text-gray-500 cursor-pointer text- hover:underline'
        onClick={() => navigate(`/followers/${userIdParam}`)}>
        {followerCountData?.followerCount} Followers
      </p>

      <span className='mt-2'>
        <p className='text-sm font-medium text-gray-500 text-wrap'>{bio}</p>
      </span>
      {isMod ? (
        <span
          className='mt-8 text-xs font-medium text-green-600 cursor-pointer'
          onClick={handleEditBtn}>
          Edit profile
        </span>
      ) : null}

      {!isMod ? (
        <span>
          <button
            className={`px-3.5 py-1.5 my-5  ${
              followingStatus
                ? "text-green-700 border border-green-700"
                : "text-white bg-green-700"
            }  rounded-full`}
            onClick={handleFollowBtn}>
            {followingStatus ? "Following" : "Follow"}
          </button>
        </span>
      ) : null}

      <span className='flex flex-col gap-4 mt-6'>
        <p className='font-medium text-gray-700'>Following</p>
        <span className=''>
          {fiveFollowingData?.map((followingUser) => {
            const name = followingUser.name
              ? `${followingUser.name
                  .charAt(0)
                  .toUpperCase()}${followingUser.name.slice(1)}`
              : "";
            return (
              <span
                key={followingUser.id}
                className='flex items-center gap-3'
                onClick={() => navigate(`/profile/${followingUser?.id}`)}>
                <Avatar className='cursor-pointer size-6'>
                  <AvatarImage
                    src={followingUser?.avatar}
                    alt=''
                  />
                  <AvatarFallback>
                    <img
                      src={profileDemo}
                      alt=''
                    />
                  </AvatarFallback>
                </Avatar>
                <p className='text-[13.5px] text-gray-500 hover:underline'>
                  {name}
                </p>
              </span>
            );
          })}
        </span>
        <span>
          {fiveFollowingData && fiveFollowingData?.length >= 5 ? (
            <p className='text-xs font-medium text-gray-500 cursor-pointer hover:underline'>
              Show all
            </p>
          ) : null}
        </span>
      </span>
    </div>
  );
};
export default ProfileSidebar;
