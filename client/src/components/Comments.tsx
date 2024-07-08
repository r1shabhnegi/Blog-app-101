import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
const Comments = ({ totalComments }: { totalComments: number }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className='flex items-center gap-2'>
          <MessageCircle className='text-gray-500 cursor-pointer size-6' />
          <p className='text-xl text-gray-400'>{totalComments}</p>
        </span>
      </SheetTrigger>
      <SheetContent className='p-5 bg-red-50 '>
        <div></div>
      </SheetContent>
    </Sheet>
  );
};
export default Comments;
