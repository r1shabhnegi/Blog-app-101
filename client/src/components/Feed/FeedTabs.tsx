import { Plus } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type props = {
  currentTab: string;
};

const FeedTabs: FC<props> = ({ currentTab }) => {
  const navigate = useNavigate();
  const active = 0;
  return (
    <div className='flex gap-7 overflow-x-auto pt-4 mt-4 border-b no-scrollbar overflow-auto border-[#e8e8e8] sticky top-0 bg-primary-bg z-50'>
      <span>
        <Plus
          size={18}
          color='gray'
          className='font-normal rounded-full cursor-pointer hover:bg-gray-200'
        />
      </span>

      <span
        className={`text-[13px] lg:flex-none flex-1 pb-3 text-center lg:text-left cursor-pointer text-gray-600 ${
          currentTab === "/"
            ? "border-b-[0.01rem] border-gray-600  font-medium"
            : "font-normal"
        }`}
        onClick={() => navigate("/")}>
        Latest
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 pb-3 text-center lg:text-left cursor-pointer text-gray-600  ${
          currentTab === "/following"
            ? "border-b-[0.01rem] border-gray-600  font-medium"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
      <span
        className={`text-[13px] lg:flex-none flex-1 text-center lg:text-left pb-3 cursor-pointer  text-gray-600 ${
          active === 1
            ? "border-b-[0.01rem] border-gray-600  font-semibold"
            : "font-normal"
        }`}
        onClick={() => navigate("/?feed=following")}>
        Following
      </span>
    </div>
  );
};
export default FeedTabs;
