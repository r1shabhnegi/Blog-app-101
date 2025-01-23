import { getFollowedTags } from "@/api/tagApi";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type props = {
  currentTab: string;
};

const FeedTabs: FC<props> = ({ currentTab }) => {
  const { data: followedTags } = useQuery({
    queryKey: ["followedTags"],
    queryFn: getFollowedTags,
  });

  const navigate = useNavigate();

  return (
    <div className='border-b pt-2 md:pt-3 lg:pt-3 xl:pt-4 lg:mt- xl:mt-4  z-50 bg-primary-bg border-[#e8e8e8] sticky top-0'>
      <div className='flex gap-3 overflow-auto overflow-x-auto sm:gap-4 md:gap-7 no-scrollbar '>
        <span
          className='flex items-center justify-center pb-2.5 md:pb-4 ml-2'
          onClick={() => navigate("/tag-suggestions")}>
          <Plus
            color='gray'
            className='font-normal rounded-full cursor-pointer size-4 sm:size-5 hover:bg-gray-200'
          />
        </span>

        <span
          className={`text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px]  pb-2 md:pb-3 text-center lg:text-left cursor-pointer text-gray-600 ${
            currentTab === "/"
              ? "border-b-[0.01rem] border-gray-600  font-medium"
              : "font-normal"
          }`}
          onClick={() => navigate("/")}>
          Latest
        </span>
        <span
          className={`text-[10px] sm:text-[11px]  md:text-[12px] lg:text-[13px]   pb-2 md:pb-3 text-center lg:text-left cursor-pointer text-gray-600  ${
            currentTab === "/following"
              ? "border-b-[0.01rem] border-gray-600  font-medium"
              : "font-normal"
          }`}
          onClick={() => navigate("/?feed=following")}>
          Following
        </span>

        {followedTags &&
          followedTags.map((tag) => (
            <span
              key={tag.name}
              className={`text-[10px] sm:text-[11px]  md:text-[12px] lg:text-[13px]   pb-2 md:pb-3 text-center lg:text-left cursor-pointer text-gray-600  ${
                currentTab === `/${tag.name}`
                  ? "border-b-[0.01rem] border-gray-600  font-medium"
                  : "font-normal"
              }`}
              onClick={() => navigate(`/?tag=${tag.name}`)}>
              {tag.name.split("")[0].toUpperCase() + tag.name.slice(1)}
            </span>
          ))}
      </div>
      <span className='absolute top-0 -right-4 z-[100] h-full blur bg-opacity-95 bg-white lg:w-8 ' />
    </div>
  );
};
export default FeedTabs;
