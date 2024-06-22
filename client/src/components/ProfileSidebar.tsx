import { useAppSelector } from "@/redux/hook";

import profileDeno from "../assets/profileImg.png";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkFollow, followAndUnFollow } from "@/api";

const ProfileSidebar = () => {
  const { name, avatar, bio } = useAppSelector((state) => state.profile);
  const { userId } = useAppSelector((state) => state.auth);
  const { userId: userIdParam } = useParams();
  const clientQuery = useQueryClient();
  const navigate = useNavigate();
  const isMod = userId === userIdParam ? true : false;

  const { data: followingStatus } = useQuery({
    queryKey: ["checkFollow", userIdParam],
    queryFn: () => checkFollow(userIdParam),
    enabled: !isMod,
  });

  const { mutateAsync: followUnFollowMutate } = useMutation({
    mutationFn: followAndUnFollow,
    onSuccess: () => {
      clientQuery.invalidateQueries({ queryKey: ["checkFollow"] });
    },
  });

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

  const handleFollowBtn = async () => {
    await followUnFollowMutate(userIdParam);
  };

  return (
    <div className='flex flex-col'>
      <span className='flex flex-col'>
        <span className='flex flex-col justify-center w-24'>
          <img
            src={profilePic}
            alt='Avatar Image'
            className='object-cover rounded-full aspect-square'
          />
        </span>
        <h1 className='mt-4 text-lg font-semibold text-gray-800'>
          {adminName}
        </h1>
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
      </span>
    </div>
  );
};
export default ProfileSidebar;
