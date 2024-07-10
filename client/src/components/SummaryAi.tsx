import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getAiSummary, getAskAi } from "@/api";
import Spinner from "./Spinner";

const SummaryAi = ({
  cancel,
  content,
}: {
  cancel: () => void;
  content: string | TrustedHTML | undefined;
}) => {
  //   const [summaryVal, setSummaryVal] = useState("");
  const {
    mutateAsync: getAiSummaryMutate,
    isPending,
    data,
  } = useMutation({
    mutationFn: getAiSummary,
  });

  const summaryContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (summaryContainer && summaryContainer.current) {
      summaryContainer.current.innerHTML = "";
    }
    // summaryContainer?.current?.innerHTML = "";
    const fetch = async () => {
      await getAiSummaryMutate({ text: content });
    };
    fetch();
  }, [content, getAiSummaryMutate]);

  useEffect(() => {
    if (data) {
      const text = data.data.text;
      const pattern = text
        .replace(/\*\*(.*?)\*\*/g, "<p>$1</p>")
        .replace(/\*/g, "<br>");

      const resultContainer = document.createElement("div");
      const resultPara = `<div>
    <span >${pattern}</span>
    </div>`;
      resultContainer.insertAdjacentHTML("afterbegin", resultPara);
      summaryContainer.current &&
        summaryContainer.current.appendChild(resultContainer);
    }
  }, [data]);

  return (
    <div
      className='fixed top-0 left-0 z-30 flex items-center justify-center w-full h-screen bg-black bg-opacity-60'
      onClick={cancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex mx-2 sm:mx-3 flex-col gap-6 p-6 bg-white w-[40rem] rounded-xl'>
        <div className='flex justify-end w-full '>
          <X
            className='text-gray-400 cursor-pointer'
            onClick={cancel}
          />
        </div>
        <h1 className='text-lg text-gray-600 text-md md:text-lg sm:font-medium '>
          Here is the brief summary
        </h1>

        {isPending && <Spinner />}
        <div
          ref={summaryContainer}
          className='max-h-[25rem] overflow-y-auto'></div>
      </div>
    </div>
  );
};
export default SummaryAi;
