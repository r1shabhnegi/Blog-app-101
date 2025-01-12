import { Plus } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { name: "Css", link: "css" },
  { name: "webDev", link: "webdev" },
  { name: "Nextjs", link: "nextjs" },
];

type props = {
  currentTab: string;
};

const FeedTabs: FC<props> = ({ currentTab }) => {
  const navigate = useNavigate();
  return (
    <div className='border-b z-50 bg-primary-bg border-[#e8e8e8] sticky top-0'>
      <div className='flex pt-4 mt-4 overflow-auto overflow-x-auto gap-7 no-scrollbar '>
        <span>
          <Plus
            size={18}
            color='gray'
            className='font-normal rounded-full cursor-pointer hover:bg-gray-200'
          />
        </span>

        <span
          className={`text-[11px] md:text-[12px] lg:text-[13px] pb-3 text-center lg:text-left cursor-pointer text-gray-600 ${
            currentTab === "/"
              ? "border-b-[0.01rem] border-gray-600  font-medium"
              : "font-normal"
          }`}
          onClick={() => navigate("/")}>
          Latest
        </span>
        <span
          className={`text-[11px] md:text-[12px] lg:text-[13px]  pb-3 text-center lg:text-left cursor-pointer text-gray-600  ${
            currentTab === "/following"
              ? "border-b-[0.01rem] border-gray-600  font-medium"
              : "font-normal"
          }`}
          onClick={() => navigate("/?feed=following")}>
          Following
        </span>

        {tabs.map((tab) => (
          <span
            key={tab.name}
            className={`text-[11px] md:text-[12px] lg:text-[13px] pb-3 text-center lg:text-left cursor-pointer text-gray-600  ${
              currentTab === `/${tab.link}`
                ? "border-b-[0.01rem] border-gray-600  font-medium"
                : "font-normal"
            }`}
            onClick={() => navigate(`/?tag=${tab.link}`)}>
            {tab.name}
          </span>
        ))}
      </div>
      <span className='absolute top-0 -right-4 z-[100] h-full blur bg-opacity-95 bg-white lg:w-8 ' />
    </div>
  );
};
export default FeedTabs;
