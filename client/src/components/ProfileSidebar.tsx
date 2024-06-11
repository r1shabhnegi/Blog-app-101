import { useAppSelector } from "@/redux/hook";

import profileDeno from "../assets/profileImg.png";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const { name, avatar, bio } = useAppSelector((state) => state.auth);
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
  console.log(avatar);
  const profilePic = avatar && avatar.length > 5 ? avatar : profileDeno;

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
          <p className='text-sm font-medium text-gray-500 text-wrap'>
            {bio}asfasfsafsfassafsn njka kjsn knk nk nkn kasna nsk nskn an kas
            nk nk nfkan ak nska nkja f Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Obcaecati possimus tenetur impedit corrupti dolor
            earum voluptas dolorum libero error! Omnis ipsum natus culpa
            perspiciatis reiciendis doloribus possimus illum, harum quaerat
            similique veniam assumenda cum odio nihil, alias neque sint enim
            minus officiis nemo consequuntur placeat. Inventore vitae obcaecati
            consequuntur mollitia!
          </p>
        </span>
        <span
          className='mt-8 text-xs font-medium text-green-600 cursor-pointer'
          onClick={handleEditBtn}>
          Edit profile
        </span>
      </span>
    </div>
  );
};
export default ProfileSidebar;
