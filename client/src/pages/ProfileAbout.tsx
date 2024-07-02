import { addAbout, getAbout } from "@/api";
import Spinner from "@/components/Spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ProfileAbout = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [aboutValue, setAboutValue] = useState<string>("");

  const { data: about, isPending } = useQuery({
    queryKey: ["userAbout"],
    queryFn: getAbout,
  });
  const { mutateAsync } = useMutation({ mutationFn: addAbout });

  useEffect(() => {
    if (about && about.about.length > 0) {
      setAboutValue(about.about);
    }
  }, [about]);

  const handleSaveBtn = async () => {
    await mutateAsync(aboutValue);
  };

  if (isPending) return <Spinner />;

  return isEdit ? (
    <form className='flex flex-col gap-5'>
      <Textarea
        className='h-28'
        onChange={(e) => setAboutValue(e.target.value)}
        value={aboutValue}
      />
      <div className='flex justify-end gap-4'>
        <button
          type='button'
          onClick={() => setIsEdit(!isEdit)}
          className='px-5 py-2 text-black border border-black rounded-full'>
          Cancel
        </button>
        <button
          type='submit'
          onClick={handleSaveBtn}
          className='px-5 py-2 text-white bg-gray-800 rounded-full '>
          Save
        </button>
      </div>
    </form>
  ) : about && about?.about.length > 0 ? (
    <div className='flex flex-col items-end gap-5'>
      <p className='w-full p-5 border-b medium text-'>{about.about}</p>
      <span>
        <button
          onClick={() => setIsEdit(!isEdit)}
          className='px-5 py-2 text-black border border-black rounded-full'>
          Edit
        </button>
      </span>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-5 p-20 bg-gray-50'>
      <h2 className='font-semibold'>Tell the world about yourself</h2>
      <p className='text-sm text-center'>
        Here’s where you can share more about yourself: your history, work
        experience, accomplishments, interests, dreams, and more. You can even
        add images and use rich text to personalize your bio.
      </p>
      <button
        className='border-[0.09rem] text-sm rounded-full py-1.5 px-3.5 border-gray-900'
        onClick={() => setIsEdit(!isEdit)}>
        Get Started
      </button>
    </div>
  );
};
export default ProfileAbout;
