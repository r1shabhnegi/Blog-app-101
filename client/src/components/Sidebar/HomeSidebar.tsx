import { homeSidebarInfo } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profileDemo from "@/assets/profileImg.png";
import { PostType } from "@/lib/types";

const HomeSidebar = () => {
  const navigate = useNavigate();
  const { data: postsData } = useQuery({
    queryKey: ["home-sidebar-info"],
    queryFn: homeSidebarInfo,
  });

  const tags = postsData?.data?.mostFollowedTags;
  const posts = postsData?.data?.posts;

  return (
    <div className='flex flex-col gap-8'>
      <div
        className='flex flex-col gap-4 items-start bg-[#C4E2FF]  p-5 rounded-md cursor-pointer'
        onClick={() => navigate("/publish")}>
        <h1 className='font-bold'>Writing on ReadPool.AI</h1>

        <div className='flex flex-col gap-2 font-semibold text-[14px]'>
          <p>New writer FAQ </p>
          <p>Expert writing advice</p>
          <p>Grow your readership</p>
        </div>

        <button className='px-3 py-1.5 text-sm font-medium text-white bg-gray-800 rounded-full'>
          Start writing
        </button>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='font-semibold text-gray-800'>Latest Topics</h1>
        <div className='flex flex-wrap gap-2'>
          {tags &&
            tags.map((tag) => (
              <span
                key={tag + tag.id}
                className='px-3 py-1 text-sm bg-gray-200 rounded-full cursor-pointer'
                onClick={() =>
                  navigate(`/tag/${tag.name.toLowerCase().trim()}`)
                }>
                {tag.name.split("")[0].toUpperCase() + tag.name.slice(1)}
              </span>
            ))}
        </div>
      </div>

      {posts && (
        <div className='flex flex-col gap-4'>
          {posts.length !== 0 && (
            <h1 className='font-semibold text-gray-800'>Recent saved posts</h1>
          )}
          <div className='flex flex-col gap-2'>
            {posts.map((post: PostType) => (
              <div
                key={post.id + post.title}
                className='my-2'>
                <div className='flex gap-2'>
                  <Avatar
                    className='cursor-pointer size-7'
                    onClick={() => navigate(`/profile/${post.authorId}`)}>
                    <AvatarImage
                      src={post.authorAvatar}
                      alt=''
                    />
                    <AvatarFallback>
                      <img
                        src={profileDemo}
                        alt=''
                      />
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className='flex flex-col'
                    onClick={() => navigate(`/post/${post.id}`)}>
                    <p className='text-sm font-medium text-gray-600 cursor-pointer hover:text-black'>
                      {post.title}
                    </p>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSidebar;
