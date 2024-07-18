import { useAppSelector } from "@/redux/hook";
import { Image, Loader, X } from "lucide-react";
import { Input } from "./ui/input";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
const PublishCard = ({
  cancel,
  titleValue,
  editorValue,
}: {
  cancel: () => void;
  titleValue: string;
  editorValue: string;
}) => {
  const [tag, setTag] = useState("");
  const [prevImg, setPrevImg] = useState<string>("");
  const [prevImgFile, setPrevImgFile] = useState<File | string>("");
  const [err, setErr] = useState<string | undefined>(undefined);
  const { name, userId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClint = useQueryClient();
  const nameFirstLetter = name?.slice(0, 1).toUpperCase();
  const nameRestLetters = name?.slice(1);
  const adminName =
    nameFirstLetter && nameRestLetters
      ? `${nameFirstLetter}${nameRestLetters}`
      : "";

  const onDrop = (acceptedFiles: File[]) => {
    const imgUrl = URL.createObjectURL(acceptedFiles[0]);
    setPrevImg(imgUrl);
    setErr(undefined);
    setPrevImgFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { mutateAsync: publishMutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClint.invalidateQueries({ queryKey: ["userPosts"] });
      toast({
        title: "Post published successfully!",
        className: "bg-green-400",
      });
      navigate(`/profile/${userId}`);
    },
  });

  const onSubmit = async () => {
    if (prevImgFile === "" || tag === "") {
      setErr("Please add preview image or at least one tag");
      return;
    }
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      let image: string | File = "";

      if (prevImgFile instanceof File) {
        image = await imageCompression(prevImgFile, options);
      } else {
        return;
      }

      const formData = new FormData();
      formData.append("title", titleValue);
      formData.append("content", editorValue);
      formData.append("tag", tag);
      formData.append("image", image);
      await publishMutate(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-white'>
      <div className=' w-full max-w-[70rem] mx-auto my-16'>
        <div
          className='flex justify-end'
          onClick={cancel}>
          <X className='hidden text-gray-500 cursor-pointer md:block size-7 ' />
        </div>
        <div className='flex flex-col items-center justify-center md:flex-row gap-14'>
          <div className='p-4 md:w-1/2'>
            <h2 className='text-lg font-semibold text-left '>
              Add Preview photo
            </h2>
            <div className='mt-3 border md:mr-10 aspect-square'>
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
          <div className='p-4 md:w-1/2 md:flex-row'>
            <h2 className='text-lg font-medium'>
              Publishing to: <span className='font-bold'>{adminName}</span>
            </h2>
            <p className='mt-4 text-[14.5px] font-medium text-gray-500'>
              Add a topic, so readers know what your story is about.
            </p>
            <Input
              className='h-16 mt-10 text-lg border bg-gray-50 focus-visible:ring-gray-400'
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                setErr(undefined);
              }}
            />
            {err && (
              <p className='py-4 mt-10 text-sm font-medium text-red-500'>
                {err}
              </p>
            )}
            <div className='flex items-center justify-end w-full'>
              <button
                type='button'
                disabled={isPending}
                className={`${
                  !err && "mt-10"
                } bg-green-600 py-1.5 px-4 font-medium rounded-full text-white`}
                onClick={onSubmit}>
                {isPending ? <Loader className='animate-spin' /> : "Publish"}
              </button>
              <button
                className={`${
                  !err && "mt-10"
                } bg-gray-400 ml-3 md:hidden py-1.5 px-4 font-medium rounded-full text-white`}
                onClick={cancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublishCard;
