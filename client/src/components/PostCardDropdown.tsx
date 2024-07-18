import { checkFollow, followAndUnFollow } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
const PostCardDropdown = ({
  isMod,
  authorId,
  handleDeletePost,
}: {
  isMod: boolean;
  authorId: string;
  handleDeletePost: () => void;
}) => {
  const clientQuery = useQueryClient();

  const { data: followingStatus } = useQuery({
    queryKey: ["checkFollow", authorId],
    queryFn: () => checkFollow(authorId),
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
            onClick={handleDeletePost}>
            <span>Delete post</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default PostCardDropdown;
