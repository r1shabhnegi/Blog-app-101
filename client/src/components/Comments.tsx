import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { useAppSelector } from "@/redux/hook";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "@/api";
import { useState } from "react";
import { useParams } from "react-router-dom";
const Comments = ({ totalComments }: { totalComments: number }) => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const { avatar, name } = useAppSelector((state) => state.auth);
  const authorName = name
    ? `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    : "";

  const { data: commentsData } = useQuery({
    queryKey: ["getComment", postId],
    queryFn: () => getComments(postId),
  });

  console.log(commentsData);
  const { mutateAsync: createCommentMutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getComment"] });
    },
  });
  const handleCommentBtn = async () => {
    await createCommentMutate({ postId, content });
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className='flex items-center gap-2'>
          <MessageCircle className='text-gray-500 cursor-pointer size-6' />
          <p className='text-xl text-gray-400'>{totalComments}</p>
        </span>
      </SheetTrigger>
      <SheetContent className='p-5 bg-red-50'>
        <div className='flex flex-col gap-4 p-3 mt-10 border shadow-xl'>
          <div className='flex items-center gap-3'>
            <Avatar className='cursor-pointer size-7'>
              <AvatarImage
                src={avatar}
                alt=''
              />
              <AvatarFallback>
                <img
                  src={profileDemo}
                  alt=''
                />
              </AvatarFallback>
            </Avatar>
            <p className='text-sm'>{authorName}</p>
          </div>
          <div className='flex items-center gap-4'>
            <Input
              type='text'
              className='text-xs'
              placeholder='Write comment'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Send
              className='text-gray-500 size-7'
              onClick={handleCommentBtn}
            />
          </div>

        </div>

        <div>
          {
            commentsData.map((elem)=>(

            ))
          }
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default Comments;
