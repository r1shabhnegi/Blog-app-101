import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getAskAi } from "@/api";
import Spinner from "./Spinner";

const AskAi = ({ cancel }: { cancel: () => void }) => {
  const [askInput, setAskInput] = useState<string>("");
  const askAiResult = useRef<HTMLDivElement>(null);

  const {
    mutateAsync: askAiMutate,
    isPending,
    data,
  } = useMutation({
    mutationFn: getAskAi,
  });
  useEffect(() => {
    if (data) {
      const text = data.data.text;
      const pattern = text
        .replace(/\*\*(.*?)\*\*/g, "<p>$1</p>")
        .replace(/\*/g, "<br>");

      const resultContainer = document.createElement("div");
      const resultPara = `<div>
    <span className='askAiContent'>${pattern}</span>
    </div>`;
      resultContainer.insertAdjacentHTML("afterbegin", resultPara);
      askAiResult.current && askAiResult.current.appendChild(resultContainer);
    }
  }, [data]);

  const askAiBtn = async () => {
    await askAiMutate({ text: askInput });
  };

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
        <form
          className='flex gap-2 rounded-xl'
          onSubmit={(e) => {
            e.preventDefault();
            askAiBtn();
          }}>
          <Input
            className='border border-gray-400 h-12 text-md focus-visible:ring-gray-900 focus-visible:ring-[0.02rem]'
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder='How can I help you today?'
          />
          <button
            className=''
            onClick={askAiBtn}>
            <Search className='text-gray-300 rounded-full size-10' />
          </button>
        </form>
        {isPending && <Spinner />}
        <div
          ref={askAiResult}
          className='max-h-[25rem] overflow-y-auto'></div>
      </div>
    </div>
  );
};
export default AskAi;
