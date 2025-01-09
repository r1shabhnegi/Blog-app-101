import { X } from "lucide-react";
import SigninCard from "./SigninCard";
import SignupCard from "./SignupCard";
import { Button } from "../ui/button";
import { FC } from "react";

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
  return (
    <div>
      <div
        className='fixed top-0 left-0 right-0 z-10 flex items-center justify-center min-h-screen overflow-hidden overflow-y-auto bg-zinc-800 scroll-smooth drop-shadow-xl translate-sty md:bg-opacity-30'
        onClick={closeCardsModal}>
        <div
          className='relative flex flex-col items-center justify-center px-32 bg-white rounded-lg md:shadow-xl py-28 gap-14'
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <X
            className='absolute hidden text-gray-400 cursor-pointer md:block top-4 right-4'
            onClick={closeCardsModal}
          />
          <h1 className='text-2xl tracking-tight font-logo'>
            {onSignin && !onSignup ? "Welcome back." : "Join readpool.ai"}
          </h1>
          {onSignup ? <SignupCard /> : null}
          {onSignin ? <SigninCard /> : null}
          <Button
            className='w-full -mt-10 bg-red-400 md:hidden'
            onClick={closeCardsModal}>
            Cancel
          </Button>
          {onSignin && !onSignup ? (
            <p className='font-semibold'>
              No account?
              <span
                className='ml-1 text-green-600 cursor-pointer'
                onClick={handleSignupBtn}>
                Create one
              </span>
            </p>
          ) : null}
          {onSignup && !onSignin ? (
            <p className='font-semibold'>
              Already have an account?
              <span
                className='ml-1 text-green-600 cursor-pointer'
                onClick={handleSignInBtn}>
                Sign in
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default AuthCard;
