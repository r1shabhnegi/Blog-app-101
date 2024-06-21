import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
const PostCardDropdown = ({
  isMod,
  handleDeletePost,
}: {
  isMod: boolean;
  handleDeletePost: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='cursor-pointer'>
        <Ellipsis className='text-gray-500 size-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-2 py-2 w-44'>
        {!isMod ? (
          <DropdownMenuItem className='font-medium text-gray-700 cursor-pointer '>
            <span>Follow author</span>
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
