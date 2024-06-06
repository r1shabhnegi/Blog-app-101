import { useForm } from "react-hook-form";

const SignupCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return <form></form>;
};
export default SignupCard;
