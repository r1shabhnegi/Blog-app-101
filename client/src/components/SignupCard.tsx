import { useForm } from "react-hook-form";
import { signupType } from "../../../common-types/index";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api";
const SignupCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupType>();

  const { mutate: mutateSignup } = useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      console.log(response);
    },
  });

  const onSubmit = handleSubmit((formData) => {
    mutateSignup(formData);
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
        className='mt-4'>
        Submit
      </Button>
    </form>
  );
};
export default SignupCard;
