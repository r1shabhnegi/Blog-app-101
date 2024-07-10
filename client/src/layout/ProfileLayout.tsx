import { useAppDispatch } from "@/redux/hook";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { countFollowing, followerCount, getUser } from "@/api";
import { useEffect } from "react";
import { setCurrentProfile } from "@/redux/profileSlice";
import Spinner from "@/components/Spinner";
import ProfileDropDown from "@/components/ProfileDropDown";

const ProfileLayout = () => {
  const { pathname } = useLocation();
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: followerCountData } = useQuery({
    queryKey: ["followerCount", userId],
    queryFn: () => followerCount(userId),
  });

  const { data: followingCountData } = useQuery({
    queryKey: ["followingCount", userId],
    queryFn: () => countFollowing(userId),
  });
  const { data: userData, isPending } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (userData) {
      dispatch(setCurrentProfile(userData));
    }
  }, [dispatch, userData]);

  const nameFirstLetter = userData?.name?.slice(0, 1).toUpperCase();
  const nameRestLetters = userData?.name?.slice(1);
  const adminName =
    nameFirstLetter && nameRestLetters
      ? `${nameFirstLetter}${nameRestLetters}`
      : "";

  const handleEditBtn = () => {
    navigate("/settings", {
      state: {
        isOpenEditCard: true,
      },
    });
  };

  if (isPending) return <Spinner />;

  return (
    <div>
      <div className='flex flex-col justify-between h-32 mt-16 mb-10'>
        <div className='flex items-center justify-between px-5 mb-5 lg:px-0'>
          <div className='flex flex-col w-full'>
            <div className='flex items-center justify-between w-full'>
              <h1 className='text-2xl font-semibold tracking-tight text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl '>
                {adminName}
              </h1>
              <ProfileDropDown prop='lg:hidden' />
            </div>
            <span className='flex gap-4 mb-1 ml-1 lg:hidden'>
              <p
                className='my-2 text-xs font-medium text-gray-500 cursor-pointer sm:text-sm text- hover:underline'
                onClick={() => navigate(`/followers/${userId}`)}>
                {followerCountData?.followerCount} Followers
              </p>
              <p
                className='my-2 text-xs font-medium text-gray-500 cursor-pointer sm:text-sm text- hover:underline'
                onClick={() => navigate(`/followings/${userId}`)}>
                {followingCountData?.data?.followingCount} Followings
              </p>
            </span>
            <span
              className='ml-1 text-xs font-medium text-green-600 cursor-pointer lg:hidden '
              onClick={handleEditBtn}>
              Edit profile
            </span>
            <span className='m-1 mt-5 text-xs lg:hidden'>{userData?.bio}</span>
          </div>
          <ProfileDropDown prop='hidden lg:block' />
        </div>

        <div className='flex gap-7 border-b-[0.01rem] border-gray-200  justify-between lg:justify-start '>
          <span
            className={`text-sm flex-1 lg:flex-none text-center font-medium pb-4 text-gray-600 cursor-pointer ${
              pathname.startsWith("/profile") &&
              !pathname.includes("list") &&
              !pathname.includes("about")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/${userId}`)}>
            Home
          </span>
          <span
            className={`text-sm flex-1 lg:flex-none text-center font-medium pb-4 cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/lists")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/lists/${userId}`)}>
            Saved
          </span>
          <span
            className={`text-sm font-medium flex-1 text-center lg:flex-none  pb-4 cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/about")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/about/${userId}`)}>
            About
          </span>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default ProfileLayout;
