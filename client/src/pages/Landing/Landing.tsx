import { Newspaper } from "lucide-react";
import { useState } from "react";
import leftImg from "@/assets/1P-ty-kpF sds.avif";
import rightImg1 from "@/assets/DsFKTQbae.avif";
import rightImg2 from "@/assets/SmU1TDZ0l.avif";
import AuthContainer from "@/components/Auth/AuthContainer";
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

  const handleSignInBtn = () => {
    setOnSignin(true);
    setOnSignup(false);
  };
  const handleSignupBtn = () => {
    setOnSignup(true);
    setOnSignin(false);
  };
  return (
    <main className='min-h-screen bg-[#fbfbfb]'>
      <div className='flex flex-col'>
        <div className='px-6 border-black shadow-2xl sm:px-16 md:px-28 lg:px-48 shadow-gray-200/35'>
          <div className='flex items-center justify-between h-16'>
            <span className='flex items-end justify-center gap-2'>
              <Newspaper className='text-green-600 size-6 sm:size-7 md:size-8' />
              <h1 className='-mb-0.5 text-md sm:text-lg md:text-2xl font-bold tracking-tighter text-gray-700 font-logo'>
                Readpool.AI
              </h1>
            </span>
            <nav className='flex gap-4'>
              <button
                className='font-semibold hover:text-green-700  text-[10px] md:px-3 md:text-[12px]'
                onClick={handleSigninBtn}>
                Sign in
              </button>
              <button
                className='px-2 md:px-5 py-1.5 md:py-2 text-[10px] md:text-[12px] font-semibold text-white bg-gray-900 hover:bg-green-600  rounded-full'
                onClick={handleGetStartedBtn}>
                Get started
              </button>
            </nav>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center flex-1 gap-6 my-12 md:gap-10 md:my-28'>
          <div className='flex flex-col text-center sm:flex-row'>
            <h1 className='text-3xl leading-normal tracking-tight text-center text-gray-900 md:text-5xl lg:text-6xl font-logo'>
              Effortless Publishing.
            </h1>
          </div>
          <span className='flex flex-col items-center justify-center text-xl md:text-3xl lg:text-4xl'>
            <h2 className='leading-relaxed text-gray-600 font-inter'>
              AI-assisted blogging
            </h2>
            <h2 className='leading-relaxed text-gray-600 font-inter'>
              for everyone.
            </h2>
          </span>
          <button
            className='px-5 md:px-8 lg:px-10 py-2 md:py-3 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[15px] font-semibold text-white bg-gray-900 rounded-full hover:bg-green-600  drop-shadow-lg'
            onClick={handleGetStartedBtn}>
            Start Writing
          </button>
        </div>
        <div
          className='flex flex-col flex-wrap justify-between gap-6 mx-6 sm:mx-20 md:mx-36 lg:mx-44 lg:flex-row'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}>
          <div className=' flex-1 border-[0.1rem] border-[#e4efff] flex items-end px-2 pt-20 pb-0 bg-[#F0F6FF] rounded-2xl'>
            <img
              src={leftImg}
              alt='Img'
            />
          </div>
          <div className='flex flex-col flex-1 gap-6'>
            <div className='h-full border-[0.1rem] flex border-[#ffeede] items-end pb-0 bg-[#FFF7EE] rounded-2xl'>
              <img
                src={rightImg1}
                alt='Img'
              />
            </div>
            <div className='border-[0.1rem] h-full flex border-[#e9e6ff] items-end pb-0 bg-[#EEECFE] rounded-2xl'>
              <img
                src={rightImg2}
                alt='Img'
              />
            </div>
          </div>
        </div>
      </div>

      {onSignup || onSignin ? (
        <AuthContainer
          closeCardsModal={closeCardsModal}
          onSignin={onSignin}
          onSignup={onSignup}
          handleSignupBtn={handleSignupBtn}
          handleSignInBtn={handleSignInBtn}
        />
      ) : null}
    </main>
  );
};
export default Landing;
