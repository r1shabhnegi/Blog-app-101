import { useAppSelector } from "@/redux/hook";

import img from "../assets/a-warm-inviting-image-of-a-lady-cooking-delicious--dbdQWVyyQkWA8FM2B2dQfw-Ge6-fWX_RTC6sZ6a6fKKrA.jpeg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditUserInfoCard from "./EditUserInfoCard";

const ProfileSidebar = () => {
  const [isEditUserInfoCard, setIsEditUserInfoCard] = useState<boolean>(false);
  const { name } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const nameFirstLetter = name?.slice(0, 1).toUpperCase();
  const nameRestLetters = name?.slice(1);
  const adminName =
    nameFirstLetter && nameRestLetters
      ? `${nameFirstLetter}${nameRestLetters}`
      : "There is no name";

  useEffect(() => {
    pathname === "/settings" && setIsEditUserInfoCard(!isEditUserInfoCard);
  }, [isEditUserInfoCard, pathname]);

  const handleEditBtn = () => {
    navigate("/settings");
  };
  return (
    <div className='flex flex-col'>
      <span className='flex flex-col gap-5'>
        <span className='flex flex-col justify-center w-24 gap-2.5'>
          <img
            src={img}
            alt='Avatar Image'
            className='object-cover rounded-full aspect-square'
          />
          <h1 className='text-lg font-semibold text-gray-800'>{adminName}</h1>
        </span>
        <span
          className='text-xs font-medium text-green-600 cursor-pointer'
          onClick={handleEditBtn}>
          Edit profile
        </span>
      </span>
      {isEditUserInfoCard ? (
        <EditUserInfoCard
          cancelBtn={() => setIsEditUserInfoCard(!isEditUserInfoCard)}
        />
      ) : null}
    </div>
  );
};
export default ProfileSidebar;
