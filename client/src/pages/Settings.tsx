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
    <div className='mx-10 sm:mx-20 md:mx-32 lg:mx-10 xl:mx-0'>
      <div className='flex flex-col justify-between my-16'>
        <h1 className='text-4xl font-semibold tracking-tight text-gray-800 sm:text-5xl '>
          Settings
        </h1>
      </div>
      <div className='flex flex-col gap-10'>
        <span
          className='text-[13.5px] flex flex-col gap-2 font-medium cursor-pointer'
          onClick={() => setIsEditUserInfoCard(!isEditUserInfoCard)}>
          <p className='text-sm text-gray-800 sm:text-base '>
            Change user information
          </p>
          <p className='text-sm text-gray-400 sm:text-base'>
            Edit your photo, name, bio, etc.
          </p>
        </span>
        <span className='text-[13.5px] flex flex-col gap-2  text-sm font-medium text-gray-800 cursor-pointer '>
          <p className='text-sm text-gray-800 sm:text-base '>Change password</p>
          <p className='text-sm text-gray-400 sm:text-base'>
            Create new password with old password
          </p>
        </span>
        <span
          className='text-[13.5px] flex flex-col gap-2  text-sm font-medium  cursor-pointer'
          onClick={() => navigate(`/reading-history/${userId}`)}>
          <p className='text-sm text-gray-800 sm:text-base'>Reading history</p>
          <p className='text-sm text-gray-400 sm:text-base'>
            Look and delete reading history
          </p>
        </span>
        {/* <span className='text-[13.5px] flex flex-col gap-2  text-sm font-medium text-gray-800 cursor-pointer '>
          <p className='text-gray-800'>Add cover</p>
          <p className='text-gray-400'>Add cover photo to your profile page</p>
        </span> */}
        <span
          className='text-sm text-[13.5px] flex flex-col gap-2 font-medium cursor-pointer'
          onClick={() => setIsDeleteAcCard(!isDeleteAcCard)}>
          <p className='text-sm text-red-600 sm:text-base'>Delete account</p>
          <p className='text-sm text-gray-400 sm:text-base'>
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
