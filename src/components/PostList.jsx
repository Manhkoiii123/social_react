import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useUserInfo } from "@hooks/index";
import { useLikePostMutation } from "@services/postApi";

const PostList = () => {
  const { isFetching, posts } = useLazyLoadPosts();
  const [likePost] = useLikePostMutation();
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
            await likePost(id).unwrap();
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};
export default PostList;
