import { checkFollow, followAndUnFollow } from "@/api";
import { deletePost } from "@/api/postApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { FC } from "react";

type Props = {
  isMod: boolean;
  authorId: string;
  postId: string;
};

const PostCardDropdown: FC<Props> = ({ isMod, authorId, postId }) => {
  const clientQuery = useQueryClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: followingStatus } = useQuery({
    queryKey: ["checkFollow", authorId],
    queryFn: () => checkFollow(authorId),
  });

  const { mutateAsync: deletePostAsync } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast({ title: "Post deleted", className: "bg-green-400" });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const { mutateAsync: followUnFollowMutate } = useMutation({
    mutationFn: followAndUnFollow,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["checkFollow"],
      });
    },
  });

  const handleFollowUser = () => {
    followUnFollowMutate(authorId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='cursor-pointer'>
        <Ellipsis className='text-gray-500 size-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-2 py-2 w-44'>
        {!isMod ? (
          <DropdownMenuItem
            className='font-medium text-gray-700 cursor-pointer '
            onClick={handleFollowUser}>
            <span>
              {followingStatus ? "Un-follow author" : "Follow author"}
            </span>
          </DropdownMenuItem>
        ) : null}
        {isMod ? (
          <DropdownMenuItem
            className='font-medium text-gray-700 cursor-pointer'
            onClick={async () => {
              await deletePostAsync(postId);
            }}>
            <span>Delete post</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default PostCardDropdown;
