import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

const AskAi = ({ cancel }: { cancel: () => void }) => {
  const [askInput, setAskInput] = useState<string>("");
  return (
    <div
      className='fixed top-0 left-0 z-30 flex items-center justify-center w-full h-screen bg-black bg-opacity-60'
      onClick={cancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex flex-col gap-6 p-6 bg-white w-[40rem] rounded-xl'>
        <div className='flex justify-end w-full '>
          <X
            className='text-gray-400 cursor-pointer'
            onClick={cancel}
          />
        </div>
        <h1 className='font-medium text-gray-600'>Ask me anything...</h1>
        <form className='flex gap-2 rounded-xl'>
          <Input
            className='border border-gray-400 h-12 text-md focus-visible:ring-gray-900 focus-visible:ring-[0.02rem]'
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder='How can I help you today?'
          />
          <button className=''>
            <Search className='text-gray-300 rounded-full size-10' />
          </button>
        </form>
        <div className=' m max-h-[25rem] overflow-y-auto'>
          <p className='mb-2 text-green-900 mx-2 text-gray-600text-[16px]'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora,
            doloremque?-
          </p>
          <p className='mx-2 pb-4 text-gray-600 border-b border-green-200 text-[15px]'>
            sfdfsdfmlkmlkmlklk lm lasnlsa as fasf asf asf Lorem ipsum, dolor sit
            amet consectetur adipisicing elit. Omnis dicta itaque accusamus
            saepe quaerat vel nihil harum numquam ipsam facilis maiores illo
            exercitationem, totam atque. Ex, tempore impedit minima libero sit
            beatae voluptatem id. Ab odit, eveniet iure tempora beatae
            laboriosam ullam accusantium doloremque tenetur, aliquam unde sit
            deserunt minus?
          </p>
        </div>
      </div>
    </div>
  );
};
export default AskAi;
