import { useAppSelector } from "@/redux/hook";

import profileDeno from "../assets/profileImg.png";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const { name, avatar } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const nameFirstLetter = name?.slice(0, 1).toUpperCase();
  const nameRestLetters = name?.slice(1);
  const adminName =
    nameFirstLetter && nameRestLetters
      ? `${nameFirstLetter}${nameRestLetters}`
      : "There is no name";

  const handleEditBtn = () => {
    navigate("/settings", {
      state: {
        isOpenEditCard: true,
      },
    });
  };

  return (
    <div className='flex flex-col'>
      <span className='flex flex-col gap-5'>
        <span className='flex flex-col justify-center w-24 gap-2.5'>
          <img
            src={avatar || profileDeno}
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
    </div>
  );
};
export default ProfileSidebar;
