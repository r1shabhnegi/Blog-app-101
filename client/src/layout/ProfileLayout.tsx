import { useAppDispatch } from "@/redux/hook";

import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api";
import { useEffect } from "react";
import { setCurrentProfile } from "@/redux/profileSlice";
import Spinner from "@/components/Spinner";
import ProfileDropDown from "@/components/ProfileDropDown";

const ProfileLayout = () => {
  const { pathname } = useLocation();
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  if (isPending) return <Spinner />;
  return (
    <div>
      <div className='flex flex-col justify-between h-32 mt-16 mb-10'>
        <div className='flex items-center justify-between'>
          <h1 className='text-5xl font-semibold tracking-tight text-gray-800 '>
            {adminName}
          </h1>
          <ProfileDropDown />
        </div>

        <div className='flex gap-7 border-b-[0.01rem] border-gray-200'>
          <span
            className={`text-sm font-medium pb-4 text-gray-600 cursor-pointer ${
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
            className={`text-sm font-medium pb-4 cursor-pointer  text-gray-600 ${
              pathname.startsWith("/profile/lists")
                ? "border-b-[0.01rem] border-gray-600"
                : ""
            }`}
            onClick={() => navigate(`/profile/lists/${userId}`)}>
            Saved
          </span>
          <span
            className={`text-sm font-medium pb-4 cursor-pointer  text-gray-600 ${
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
