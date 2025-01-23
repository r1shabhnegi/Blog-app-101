import { checkTagFollow, followTag } from "@/api/tagApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpenText, Dot } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type props = {
  id: string;
  name: string;
  _count: {
    posts: number;
    followers: number;
  };
};

const TagSuggestionCard: FC<props> = ({ _count, id, name }) => {
  const [isFollow, setIsFollow] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: followData,
    isSuccess,
    isLoading: followingDataLoading,
  } = useQuery({
    queryKey: ["checkTagFollow", id],
    queryFn: () => checkTagFollow(id),
  });

  useEffect(() => {
    if (isSuccess && followData) {
      setIsFollow(followData.isFollow);
    }
  }, [isSuccess, followData]);

  const { mutateAsync } = useMutation({
    mutationKey: ["followTag", id],
    mutationFn: followTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkTagFollow", id] });
      queryClient.invalidateQueries({ queryKey: ["tagSuggestions"] });
    },
  });

  const handleFollowTag = async (tagId: string) => {
    try {
      setIsFollow(!isFollow);
      await mutateAsync(tagId);
    } catch (error) {
      console.error("Error following/unfollowing tag:", error);
    }
  };

  return (
    <div
      key={id}
      className='flex mb-2 items-center justify-between  w-full mx-4 sm:mx-0 sm:w-[30rem] md:w-[20rem] cursor-pointer'>
      <span
        className='flex items-center justify-center'
        onClick={() => navigate(`/tag/${name.toLowerCase().trim()}`)}>
        <span className='flex items-center justify-center mr-2 rounded-full bg-zinc-100 size-10 md:size-12 lg:size-14'>
          <BookOpenText className='text-gray-400 size-4 md:size-5 lg:size-6' />
        </span>
        <span className='flex flex-col gap-1'>
          <span>
            <p className='text-[10.5px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13.5px] font-semibold text-gray-800'>
              {name}
            </p>
          </span>
          <span className='text-[10px] sm:text-[11px] md:text-[12px] flex justify-center items-center'>
            <p>{_count?.posts} Stories</p>
            <Dot
              size={15}
              className='text-gray-500'
            />
            <p>{_count?.followers} Readers</p>
          </span>
        </span>
      </span>
      {!followingDataLoading && (
        <>
          {isFollow ? (
            <span
              className='text-[10px] cursor-pointer md:text-[11px] lg:text-[12px] rounded-full px-2 py-0.5 border-[0.1rem] border-gray-700'
              onClick={() => handleFollowTag(id)}>
              Following
            </span>
          ) : (
            <span
              className='bg-gray-800 cursor-pointer text-[10px] md:text-[11px] lg:text-[12px]  text-white rounded-full px-2 py-0.5'
              onClick={() => handleFollowTag(id)}>
              Follow
            </span>
          )}
        </>
      )}
    </div>
  );
};
export default TagSuggestionCard;
