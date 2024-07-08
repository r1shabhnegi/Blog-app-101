import { fiveSavedPost, tagNames } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppSelector } from "@/redux/hook";
import profileDemo from "../assets/profileImg.png";

const HomeSidebar = () => {
  const navigate = useNavigate();
  const { data: fiveSavedPosts } = useQuery({
    queryKey: ["fiveSavedPosts"],
    queryFn: fiveSavedPost,
  });
  console.log(fiveSavedPosts);
  const { data } = useQuery({ queryKey: ["tagNames"], queryFn: tagNames });

  const { name, avatar } = useAppSelector((state) => state.auth);

  const authorName = name
    ? `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    : "";
  return (
    <div className='flex flex-col gap-10'>
      <div className='bg-[#C4E2FF]  p-5 rounded-md'>
        <p className='mb-4 font-semibold'>
          Write articles, share knowledge and learn
        </p>

        <button
          className='px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-full'
          onClick={() => navigate("/publish")}>
          Start writing
        </button>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='font-semibold text-gray-800'>Latest Tags</h1>
        <div className='flex gap-2'>
          {data &&
            data.map((tag) => (
              <span
                key={`${tag}+${Math.round(Math.random() * 1000)}`}
                className='px-3 py-1 text-sm bg-gray-200 rounded-full cursor-pointer'
                onClick={() => navigate(`/tag/${tag.name}`)}>
                {tag.name}
              </span>
            ))}
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='font-semibold text-gray-800'>Recent saved posts</h1>
        <div className='flex flex-col gap-2'>
          {fiveSavedPosts?.data.map(
            (post: { createdAt: string; readTime: string; title: string }) => (
              <div className='my-2'>
                <div className='flex gap-2 '>
                  <Avatar className='cursor-pointer size-7'>
                    <AvatarImage
                      src={avatar}
                      alt=''
                    />
                    <AvatarFallback>
                      <img
                        src={profileDemo}
                        alt=''
                      />
                    </AvatarFallback>
                  </Avatar>
                  <span className='flex flex-col'>
                    {/* <p className='text-[13px]'>{authorName}</p> */}
                    <p className='text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-800'>
                      {post.title}
                    </p>
                    {/* <p className='text-xs text-gray-600'>{ createdDate}</p> */}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default HomeSidebar;
