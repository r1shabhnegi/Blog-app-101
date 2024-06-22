import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
const Comments = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='hover:bg-white'>
          <MessageCircle className='text-gray-500 cursor-pointer size-6' />
        </Button>
      </SheetTrigger>
      <SheetContent></SheetContent>
    </Sheet>
  );
};
export default Comments;
