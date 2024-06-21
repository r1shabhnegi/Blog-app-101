import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { postId } = useParams();
  console.log(postId);
  return <div>PostDetail</div>;
};
export default PostDetail;
