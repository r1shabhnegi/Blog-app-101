import { tagNames } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const HomeSidebar = () => {
  const navigate = useNavigate();

  const { data } = useQuery({ queryKey: ["tagNames"], queryFn: tagNames });
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

      <div></div>
    </div>
  );
};
export default HomeSidebar;
