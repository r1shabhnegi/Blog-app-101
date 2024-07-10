import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import profileDemo from "../assets/profileImg.png";
import { useAppSelector } from "@/redux/hook";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "@/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";
import { commentType } from "@/lib/types";
import CommentCard from "./CommentCard";
const Comments = ({ totalComments }: { totalComments: number }) => {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<commentType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const { avatar, name } = useAppSelector((state) => state.auth);
  const authorName = name
    ? `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    : "";

  const { data: commentsData, refetch } = useQuery({
    queryKey: ["getComment", postId, page],
    queryFn: () => getComments({ postId, page }),
    enabled: !!postId,
  });

  useEffect(() => {
    if (commentsData) {
      setComments((prevComments) => [
        ...prevComments,
        ...commentsData.commentInfo,
      ]);
      setNumberOfComments(commentsData.numberOfComments);
    }
  }, [commentsData]);

  const { mutateAsync: createCommentMutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getComment"] });
    },
  });
  const handleCommentBtn = async () => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    await createCommentMutate({ postId, content });
  };

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    if (numberOfComments > comments.length) {
      refetch();
    } else {
      setHasMore(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className='flex items-center gap-2'>
          <MessageCircle className='text-gray-500 cursor-pointer size-5 sm:size-6' />
          <p className='text-base text-gray-400 sm:text-xl'>{totalComments}</p>
        </span>
      </SheetTrigger>
      <SheetContent className='p-5 overflow-auto'>
        <div className='flex flex-col gap-4 p-3 mt-10 border shadow-lg'>
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

        <div className='p-5 mt-10 overflow-auto border shadow-2xl'>
          <InfiniteScroll
            className='flex flex-col items-center justify-center'
            dataLength={comments.length}
            hasMore={hasMore}
            loader={<Spinner />}
            next={fetchMorePosts}>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id + Math.round(Math.random() * 1000)}
                commentData={comment}
              />
            ))}
          </InfiniteScroll>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default Comments;
