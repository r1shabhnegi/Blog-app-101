import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { signup, signin } from "@/api/authApi";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/redux/hook";
import { setUserCredentials } from "@/redux/authSlice";
import { LoaderCircle } from "lucide-react";
import { SignupType } from "@/lib/types";

const SignupCard = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>();

  const { mutateAsync: mutateSignin, isPending: signinPending } = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      dispatch(setUserCredentials(response));
    },
    onError: () => {
      toast({
        title: "Error! Now try singing in",
        className: "bg-red-400",
      });
    },
  });

  const { mutateAsync: mutateSignup, isPending: signupPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({ title: "User created successfully!", className: "bg-green-400" });
    },
    onError: () => {
      toast({
        title: "Error creating user, Please try again!",
        className: "bg-red-400",
      });
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    const response = await mutateSignup(formData);
    if (response) {
      await mutateSignin({
        email: formData.email,
        password: formData.password,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-4 w-72'>
      <label className='text-xs font-semibold text-gray-400'>
        Name
        <Input
          type='text'
          className='text-[#454545] my-0.5 border-gray-300 focus-visible:ring-gray-600'
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
        />
        {errors?.name && (
          <p className='text-xs font-semibold text-red-500'>
            {errors?.name?.message}
          </p>
        )}
      </label>
      <label className='text-xs font-semibold text-gray-400'>
        Email
        <Input
          type='text'
          className='text-[#454545] my-0.5 border-gray-300 focus-visible:ring-gray-600'
          {...register("email", {
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors?.email && (
          <p className='text-xs font-semibold text-red-500'>
            {errors?.email?.message}
          </p>
        )}
      </label>
      <label className='text-xs font-semibold text-gray-400'>
        Password
        <Input
          type='password'
          className='text-[#454545] my-0.5 border-gray-300 focus-visible:ring-gray-600'
          {...register("password", {
            minLength: {
              value: 4,
              message: "Must be 4 or more characters long",
            },
            maxLength: {
              value: 20,
              message: "Must be 20 or fewer characters long",
            },
          })}
        />
        {errors?.password && (
          <p className='text-xs font-semibold text-red-500'>
            {errors?.password?.message}
          </p>
        )}
      </label>
      <Button
        type='submit'
        disabled={signupPending || signinPending}
        className='mt-4'>
        {signupPending || signinPending ? (
          <LoaderCircle className='mr-1 animate-spin size-4' />
        ) : null}
        Submit
      </Button>
    </form>
  );
};
export default SignupCard;
