import { useAppSelector } from "@/redux/hook";
import { Image, X } from "lucide-react";
import { Input } from "./ui/input";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "@/api";
const PublishCard = ({
  cancel,
  titleValue,
  editorValue,
}: {
  cancel: () => void;
  titleValue: string;
  editorValue: string;
}) => {
  //   const [isAvatarRemoved, SetIsAvatarRemoved] = useState<"false" | "true">(
  //     "false"
  //   );
  const [tags, setTags] = useState("");
  const [prevImg, setPrevImg] = useState<string>("");
  const [prevImgFile, setPrevImgFile] = useState<File | string>("");
  const { name } = useAppSelector((state) => state.auth);
  const [err, setErr] = useState<string | undefined>(undefined);
  const nameFirstLetter = name?.slice(0, 1).toUpperCase();
  console.log(nameFirstLetter);
  const nameRestLetters = name?.slice(1);
  const adminName =
    nameFirstLetter && nameRestLetters
      ? `${nameFirstLetter}${nameRestLetters}`
      : "There is no name";

  const onDrop = (acceptedFiles: File[]) => {
    const imgUrl = URL.createObjectURL(acceptedFiles[0]);
    setPrevImg(imgUrl);
    setErr(undefined);
    setPrevImgFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { mutateAsync: publishMutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (response) => {
      console.log(response);
    },
  });

  const onSubmit = async () => {
    if (prevImgFile === "" || tags === "") {
      setErr("Please add preview image or at least one tag");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleValue);
    formData.append("content", editorValue);
    formData.append("tags", tags);
    formData.append("image", prevImgFile);
    await publishMutate(formData);
  };

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 z-50 bg-white'>
      <div className=' w-full max-w-[70rem] mx-auto my-16'>
        <div className='flex justify-end'>
          <X
            className='text-gray-500 cursor-pointer size-7 '
            onClick={cancel}
          />
        </div>
        <div className='px-10'>
          <div className='flex items-center justify-center gap-14'>
            <div className='w-1/2 p-4'>
              <h2 className='text-lg font-semibold '>Add Preview photo</h2>
              <div className='mt-3 mr-10 border aspect-square'>
                <div
                  {...getRootProps()}
                  role='button'>
                  <input
                    {...getInputProps()}
                    className='w-full'
                  />
                  {prevImg.length === 0 ? (
                    <Image className='w-full h-full p-10 text-gray-100' />
                  ) : (
                    <img
                      src={prevImg}
                      alt='img'
                      className='object-cover aspect-square'
                    />
                  )}
                </div>
              </div>
            </div>
            <div className='w-1/2 p-4'>
              <h2 className='text-lg font-medium'>
                Publishing to: <span className='font-bold'>{adminName}</span>
              </h2>
              <p className='mt-4 text-[14.5px] font-medium text-gray-500'>
                Add or change topics (up to 5) so readers know what your story
                is about, write next topic with comma.
              </p>
              <Input
                className='h-16 mt-10 text-lg border bg-gray-50 focus-visible:ring-gray-400'
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setErr(undefined);
                }}
              />
              {err && (
                <p className='py-4 mt-10 text-sm font-medium text-red-500'>
                  {err}
                </p>
              )}
              <button
                type='button'
                className={`${
                  !err && "mt-10"
                } bg-green-600 py-1.5 px-4 font-medium rounded-full text-white`}
                onClick={onSubmit}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublishCard;
