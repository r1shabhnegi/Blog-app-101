import DeleteAcCard from "@/components/DeleteAcCard";
import EditUserInfoCard from "@/components/EditUserInfoCard";
import { useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Settings = () => {
  const [isEditUserInfoCard, setIsEditUserInfoCard] = useState<boolean>(false);
  const [isDeleteAcCard, setIsDeleteAcCard] = useState<boolean>(false);

  const { userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { state } = useLocation();
  const isOpenEditCard = state?.isOpenEditCard;

  useEffect(() => {
    if (isOpenEditCard) {
      setTimeout(() => {
        setIsEditUserInfoCard(isOpenEditCard);
      }, 200);
    }
  }, [isOpenEditCard]);

  return (
    <div>
      <div className='flex flex-col justify-between my-16'>
        <h1 className='text-5xl font-semibold tracking-tight text-gray-800 '>
          Settings
        </h1>
      </div>
      <div className='flex flex-col gap-10'>
        <span
          className='text-[13.5px] flex flex-col gap-2 font-medium cursor-pointer'
          onClick={() => setIsEditUserInfoCard(!isEditUserInfoCard)}>
          <p className='text-gray-800 '>Change user information</p>
          <p className='text-gray-400'>Edit your photo, name, bio, etc.</p>
        </span>
        <span className='text-[13.5px] flex flex-col gap-2  text-sm font-medium text-gray-800 cursor-pointer '>
          <p className='text-gray-800 '>Change password</p>
          <p className='text-gray-400'>Create new password with old password</p>
        </span>
        <span
          className='text-[13.5px] flex flex-col gap-2  text-sm font-medium  cursor-pointer'
          onClick={() => navigate(`/reading-history/${userId}`)}>
          <p className='text-gray-800'>Reading history</p>
          <p className='text-gray-400'>Look and delete reading history</p>
        </span>
        {/* <span className='text-[13.5px] flex flex-col gap-2  text-sm font-medium text-gray-800 cursor-pointer '>
          <p className='text-gray-800'>Add cover</p>
          <p className='text-gray-400'>Add cover photo to your profile page</p>
        </span> */}
        <span
          className='text-sm text-[13.5px] flex flex-col gap-2 font-medium cursor-pointer'
          onClick={() => setIsDeleteAcCard(!isDeleteAcCard)}>
          <p className='text-red-600'>Delete account</p>
          <p className='text-gray-400'>
            Permanently delete your account and all of your content.
          </p>
        </span>
      </div>
      {isEditUserInfoCard ? (
        <EditUserInfoCard
          cancelBtn={() => setIsEditUserInfoCard(!isEditUserInfoCard)}
        />
      ) : null}

      {isDeleteAcCard ? (
        <DeleteAcCard cancelBtn={() => setIsDeleteAcCard(!isDeleteAcCard)} />
      ) : null}
    </div>
  );
};
export default Settings;
