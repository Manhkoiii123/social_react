import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useUserInfo } from "@hooks/index";
import { useLikePostMutation, useUnlikePostMutation } from "@services/postApi";

const PostList = () => {
  const { isFetching, posts } = useLazyLoadPosts();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const { _id } = useUserInfo();
  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post._id}
          id={post._id}
          fullName={post.author?.fullName}
          createdAt={post.createdAt}
          content={post.content}
          image={post.image}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.likes.some((like) => like.author?._id === _id)}
          onLike={async (id) => {
            if (post.likes.some((like) => like.author?._id === _id)) {
              await unlikePost({ postId: id });
            } else {
              await likePost({ postId: id });
            }
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};
export default PostList;
