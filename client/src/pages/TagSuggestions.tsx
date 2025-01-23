import { tagSuggestions } from "@/api/tagApi";
import Spinner from "@/components/Spinner";
import TagSuggestionCard from "@/components/Tag/TagSuggestionCard";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

const TagSuggestions = () => {
  const [tags, setTags] = useState<
    {
      id: string;
      name: string;
      _count: {
        posts: number;
        followers: number;
      };
    }[]
  >([]);

  const { data, isLoading: tagSuggestionsLoading } = useQuery({
    queryKey: ["tagSuggestions"],
    queryFn: tagSuggestions,
  });

  useEffect(() => {
    if (data) {
      setTags(data);
    }
  }, [data]);

  return (
    <div className='mx-2 md:mx-0'>
      <div className='my-16'>
        <h1 className='text-2xl font-semibold tracking-tight text-center text-gray-800 lg:text-start sm:text-3xl md:text-4xl lg:text-5xl'>
          Top Suggestions
        </h1>
      </div>

      {tagSuggestionsLoading && <Spinner className='mt-40' />}
      <div className='flex flex-wrap items-center justify-center gap-2 lg:justify-start lg:items-start sm:gap-4 md:gap-8'>
        {tags &&
          tags.map((tag) => (
            <TagSuggestionCard
              key={tag.id}
              name={tag.name}
              id={tag.id}
              _count={tag._count}
            />
          ))}
      </div>
    </div>
  );
};
export default TagSuggestions;
