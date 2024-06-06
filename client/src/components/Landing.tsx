import {
  Cat,
  Club,
  Drum,
  KeyRound,
  Library,
  Newspaper,
  Smile,
  Tv,
  X,
} from "lucide-react";
import { useState } from "react";
import SignupCard from "./SignupCard";
import SigninCard from "./SigninCard";
const Landing = () => {
  const [onSignup, setOnSignup] = useState<boolean>(false);
  const [onSignin, setOnSignin] = useState<boolean>(false);

  const handleGetStartedBtn = () => {
    setOnSignup(!onSignup);
  };
  const handleSigninBtn = () => {
    setOnSignin(!onSignin);
  };

  const closeCardsModal = () => {
    setOnSignup(false);
    setOnSignin(false);
  };
  return (
    <main className='min-h-screen flex flex-col bg-[#ffffff]'>
      <div className='border-b[0.01rem] border-black px-48 shadow-2xl shadow-gray-200/35 drop-shadow-md'>
        <header className='flex items-center justify-between h-20'>
          <span className='flex items-center justify-center gap-2'>
            <Newspaper className='text-green-500 size-9' />
            <h1 className='text-3xl font-bold tracking-tighter font-logo'>
              Readpool.AI
            </h1>
          </span>

          <nav className='flex gap-4'>
            <button
              className='font-semibold hover:text-green-700  text-[14px] px-3 py-2'
              onClick={handleSigninBtn}>
              Sign in
            </button>
            <button
              className='px-3 py-2 text-[14px] font-semibold text-white bg-black hover:bg-green-600  rounded-full'
              onClick={handleGetStartedBtn}>
              Get started
            </button>
          </nav>
        </header>
      </div>
      <div className='flex flex-col items-center justify-center flex-1 gap-10 px-48'>
        <h1 className='text-5xl tracking-tight font-logo'>
          Effortless Publishing.
        </h1>
        <span className='flex flex-col items-center justify-center'>
          <h2 className='text-4xl text-gray-500 font-inter'>
            AI-assisted blogging for
          </h2>
          <h2 className='text-4xl text-gray-500 font-inter'>
            developers and teams.
          </h2>
        </span>
        <button
          className='px-4 py-2 text-[18px] font-semibold text-white bg-black rounded-full hover:bg-green-600  drop-shadow-lg'
          onClick={handleGetStartedBtn}>
          Get started
        </button>
      </div>
      <div className='flex justify-between py-10 px-28'>
        <Smile className='text-gray-100 -rotate-12 size-14' />
        <Library className='text-gray-100 size-14' />
        <Drum className='text-gray-100 rotate-6 size-14' />
        <Tv className='text-gray-100 -rotate-45 size-14' />
        <Club className='text-gray-100 size-14' />
        <Cat className='text-gray-100 rotate-12 size-14' />
        <KeyRound className='text-gray-100 size-14' />
      </div>

      {onSignup || onSignin ? (
        <div
          className='absolute top-0 flex items-center justify-center w-full min-h-screen bg-white translate-sty bg-opacity-70'
          onClick={closeCardsModal}>
          <div
            className='relative flex flex-col justify-center bg-white shadow-2xl rounded-3xl p-36'
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <X
              className='absolute text-gray-400 cursor-pointer top-4 right-4'
              onClick={closeCardsModal}
            />
            <h1 className='text-2xl tracking-tighter font-logo'>
              {onSignin && !onSignup ? "Welcome back." : "Join readpool.ai"}
            </h1>
            {onSignup ? <SignupCard /> : null}
            {onSignin ? <SigninCard /> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
};
export default Landing;
