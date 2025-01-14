import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/api/userApi";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hook";
import { setLogout } from "@/redux/authSlice";

const DeleteAcCard = ({ cancelBtn }: { cancelBtn: () => void }) => {
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { mutateAsync: deleteAcMutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      dispatch(setLogout());
      toast({
        title: "Account Deleted Successfully",
        className: "bg-green-400",
      });
      navigate("/");
    },
  });

  const handleDeleteAccount = async () => {
    await deleteAcMutate({ password });
  };

  return (
    <div
      className='fixed top-0 left-0 right-0 z-10 flex items-center justify-center min-h-screen overflow-hidden overflow-y-auto bg-black scroll-smooth drop-shadow-xl translate-sty bg-opacity-20'
      onClick={cancelBtn}>
      <div
        className='relative gap-8 flex flex-col w-[35rem] justify-center px-8 py-14 bg-white rounded-lg shadow-xl'
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <X
          className='absolute text-gray-400 cursor-pointer top-4 right-4'
          onClick={cancelBtn}
        />
        <p>
          We’re sorry to see you go. Once your account is deleted, all of your
          content will be permanently gone, including your profile, stories,
          publications, notes, and responses.
        </p>
        <p>To confirm deletion, type your password below:</p>
        <label className='mb-2 text-sm font-medium text-gray-600 '>
          Password
          <Input
            className='bg-gray-100 border-none focus-visible:ring-1'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className='flex justify-end gap-3'>
          <button
            className='px-4 py-1.5 h-10  font-medium text-sm text-red-700 border-2 border-red-700 rounded-full'
            onClick={cancelBtn}>
            Cancel
          </button>
          <button
            className='px-4  h-10 py-1.5 text-sm font-medium text-white bg-red-700 border-2 border-red-700 rounded-full'
            onClick={handleDeleteAccount}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteAcCard;
