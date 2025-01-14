import { X } from "lucide-react";
import SigninCard from "./SigninCard";
import SignupCard from "./SignupCard";
import { Button } from "../ui/button";
import { FC, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "@/api/authApi";

interface props {
  closeCardsModal: () => void;
  onSignin: boolean;
  onSignup: boolean;
  handleSignupBtn: () => void;
  handleSignInBtn: () => void;
}

const AuthCard: FC<props> = ({
  closeCardsModal,
  onSignin,
  onSignup,
  handleSignupBtn,
  handleSignInBtn,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const responseGoogle = async (authResult: { code?: string }) => {
    try {
      if (authResult["code"]) {
        const result = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/googleLogin}`,
          {
            credentials: "include",
          }
        );
        console.log(result);
        // const result = await googleAuth(authResult["code"]);
        console.log(result);
      }
      console.log(authResult);
    } catch (error) {
      console.log("error while requesting google code: ", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.log("Google login error: ", error);
    },

    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: "http://localhost:5173/",
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center w-full h-screen overflow-hidden bg-primary-bg md:bg-zinc-400/30 transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"} 
        `}
      onClick={closeCardsModal}>
      <div
        className={`relative flex flex-col items-center justify-center px-24 bg-primary-bg rounded-lg md:shadow-xl py-16
            transition-transform duration-300 transform
            ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-4 opacity-0 scale-95"
            }
          `}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <X
          className='absolute hidden text-gray-400 transition-colors cursor-pointer hover:text-gray-600 md:block top-4 right-4'
          onClick={closeCardsModal}
        />
        <h1 className='text-2xl tracking-tight font-logo mb-14'>
          {onSignin && !onSignup ? "Welcome back." : "Join readpool.ai"}
        </h1>

        <div className='transition-opacity duration-200'>
          {onSignup ? <SignupCard /> : null}
          {onSignin ? <SigninCard /> : null}
        </div>

        <div className='w-full mt-4 md:border-t-2 md:pt-8 md:mt-8 md:mb-8'>
          <Button
            className='w-full transition-colors bg-slate-400 hover:bg-slate-500'
            onClick={googleLogin}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 30 30'
              width='25px'
              height='25px'
              fill='white'>
              <path d='M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z' />
            </svg>
          </Button>
        </div>

        <Button
          className='w-full mt-4 mb-4 transition-colors bg-red-400 hover:bg-red-500 md:hidden'
          onClick={closeCardsModal}>
          Cancel
        </Button>

        {onSignin && !onSignup ? (
          <p className='text-sm font-semibold tracking-wide text-gray-800'>
            No account?
            <span
              className='ml-1 text-green-600 transition-colors cursor-pointer hover:text-green-700'
              onClick={handleSignupBtn}>
              Create one
            </span>
          </p>
        ) : null}

        {onSignup && !onSignin ? (
          <p className='text-sm font-semibold tracking-wide text-gray-800'>
            Already have an account?
            <span
              className='ml-1 text-green-600 transition-colors cursor-pointer hover:text-green-700'
              onClick={handleSignInBtn}>
              Sign in
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default AuthCard;
