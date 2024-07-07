import { VenetianMask, X } from "lucide-react";
import profileDeno from "../assets/profileImg.png";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { EditUserInfoType } from "../../../common-types/index";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { editUserInfo } from "@/api";
import imageCompression from "browser-image-compression";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
// import { useNavigate } from "react-router-dom";
const EditUserInfoCard = ({ cancelBtn }: { cancelBtn: () => void }) => {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const queryClient = useQueryClient();
  // query.
  const { toast } = useToast();
  const {
    avatar: avatarImg,
    name,
    bio,
  } = useAppSelector((state) => state.auth);

  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (avatarImg && avatarImg?.length > 5) {
      setAvatar(avatarImg);
    } else {
      setAvatar(profileDeno);
    }
  }, [avatarImg]);

  const [isAvatarRemoved, SetIsAvatarRemoved] = useState<"false" | "true">(
    "false"
  );
  const [avatarFile, setAvatarFile] = useState<File | string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserInfoType>();

  const { mutateAsync: mutateEditUserInfo } = useMutation({
    mutationFn: editUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refreshToken"] });
      toast({
        title: "User information updated successfully",
        className: "bg-green-400",
      });
      cancelBtn();
    },
  });

  useEffect(() => {
    reset({ name, bio });
  }, [bio, name, reset]);

  const onDrop = (acceptedFiles: File[]) => {
    const imgUrl = URL.createObjectURL(acceptedFiles[0]);
    SetIsAvatarRemoved("false");
    setAvatar(imgUrl);
    setAvatarFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const {
    getRootProps: anotherGetRootProps,
    getInputProps: anotherGetInputProps,
  } = useDropzone({
    onDrop,
  });

  const handleRemoveBtn = () => {
    SetIsAvatarRemoved("true");
    setAvatarFile("");
    setAvatar(profileDeno);
  };

  const onSubmit = handleSubmit(async (data) => {
    const options = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    function appendFormData(
      formData: FormData,
      data: EditUserInfoType,
      avatarFile: File | string
    ) {
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      formData.append("isAvatarRemoved", isAvatarRemoved);
      if (isAvatarRemoved === "true") {
        formData.append("avatar", "");
      } else {
        formData.append("avatar", avatarFile);
      }
     
      return formData;
    }
    try {
      let avatarImg;
      if (avatarFile instanceof File) {
        avatarImg = await imageCompression(avatarFile, options);
      } else {
        avatarImg = "";
      }

      const formData = new FormData();
      const allInputs = appendFormData(formData, data, avatarImg);
      await mutateEditUserInfo(allInputs);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div
      className='fixed top-0 left-0 right-0 z-10 flex items-center justify-center min-h-screen overflow-hidden overflow-y-auto bg-black scroll-smooth drop-shadow-xl translate-sty bg-opacity-20'
      onClick={cancelBtn}>
      <div
        className='relative flex flex-col w-[35rem] justify-center px-8 py-12 bg-white rounded-lg shadow-xl'
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <X
          className='absolute text-gray-400 cursor-pointer top-4 right-4'
          onClick={cancelBtn}
        />
        <h1 className='mb-8 text-xl font-medium tracking-tight text-center'>
          Profile information
        </h1>
        <form
          onSubmit={onSubmit}
          className='flex flex-col gap-10'>
          <div className='flex gap-6'>
            <label className='cursor-pointer'>
              <h2 className='mb-2 text-sm font-medium text-gray-600 '>
                Avatar
              </h2>
              <span className='flex flex-col justify-center w-24'>
                <div
                  {...getRootProps()}
                  role='button'
                  onClick={() => console.log("ava")}>
                  <input {...getInputProps()} />

                  <img
                    src={avatar}
                    alt='img'
                    className='object-cover rounded-full aspect-square'
                  />
                </div>
              </span>
            </label>
            <span className='flex flex-col -mb-4 justify-evenly'>
              <span className='flex gap-4'>
                <span className='text-[15px] cursor-pointer text-green-600 font-medium'>
                  Change
                  <div
                    {...anotherGetRootProps()}
                    role='button'
                    onClick={() => console.log("ava")}>
                    <input
                      {...anotherGetInputProps()}
                      accept='image/*'
                    />
                  </div>
                </span>
                <span
                  className='text-[15px] cursor-pointer text-red-700 font-medium'
                  onClick={handleRemoveBtn}>
                  Remove
                </span>
              </span>
              <h3 className='text-sm font-medium text-gray-400'>
                Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
                side.
              </h3>
            </span>
          </div>

          <label className='text-sm font-medium text-gray-600'>
            <span className='flex justify-between'>
              <p>Name</p>
              <p>20 or less</p>
            </span>

            <Input
              {...register("name", {
                minLength: {
                  value: 4,
                  message: "Must be 4 or more characters long",
                },
                maxLength: {
                  value: 20,
                  message: "Must be 20 or fewer characters long",
                },
              })}
              className='bg-gray-100 border-none focus-visible:ring-1'
            />
            {errors?.name && (
              <p className='text-xs font-semibold text-red-500'>
                {errors.name.message}
              </p>
            )}
          </label>
          <label className='text-sm font-medium text-gray-600'>
            <span className='flex justify-between'>
              <p>Bio</p>
              <p>160 or less</p>
            </span>

            <Textarea
              rows={4}
              {...register("bio", {
                maxLength: {
                  value: 160,
                  message: "Must be 160 or fewer characters long",
                },
              })}
              className='bg-gray-100 border-none resize-none focus-visible:ring-1'
            />

            {errors?.bio && (
              <p className='text-xs font-semibold text-red-500'>
                {errors.bio.message}
              </p>
            )}
          </label>
          <div className='flex items-center justify-end gap-6'>
            <button
              type='button'
              className='px-4 py-1.5 text-sm h-10 font-medium text-green-700 border-2 border-green-700 rounded-full'
              onClick={cancelBtn}>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-1.5 text-sm h-10  font-medium text-white bg-green-700 border-2 border-green-700 rounded-full '>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditUserInfoCard;
