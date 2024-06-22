import { useAppSelector } from "@/redux/hook";

import profileDeno from "../assets/profileImg.png";
import { useNavigate, useParams } from "react-router-dom";

const ProfileSidebar = () => {
  const { name, avatar, bio } = useAppSelector((state) => state.profile);
  const { userId } = useAppSelector((state) => state.auth);
  const { userId: userIdParam } = useParams();

  console.log(userId);
  console.log(userIdParam);

  const isMod = userId === userIdParam ? true : false;

  const navigate = useNavigate();

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

  const handleFollowBtn = async () => {};

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
              className='px-3.5 py-1.5 my-5 text-white bg-green-700 rounded-full'
              onClick={handleFollowBtn}>
              Follow
            </button>
          </span>
        ) : null}
      </span>
    </div>
  );
};
export default ProfileSidebar;
