import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useNotifications, useUserInfo } from "@hooks/index";
import {
  useCreateCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} from "@services/postApi";

const PostList = ({ userId }) => {
  const { isFetching, posts } = useLazyLoadPosts({ userId });
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const { createNotification } = useNotifications();
  const [createComment] = useCreateCommentMutation();
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
          authorId={post.author?._id}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.likes.some((like) => like.author?._id === _id)}
          onLike={async (postId) => {
            if (post.likes.some((like) => like.author?._id === _id)) {
              await unlikePost(postId);
            } else {
              const res = await likePost(postId).unwrap();
              createNotification({
                receiverUserId: post.author?._id,
                postId: post._id,
                notificationType: "like",
                notificationTypeId: res._id,
              });
            }
          }}
          onComment={async ({ comment, postId }) => {
            const res = await createComment({ comment, postId }).unwrap();

            createNotification({
              receiverUserId: post.author?._id,
              postId: post._id,
              notificationType: "comment",
              notificationTypeId: res._id,
            });
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};
export default PostList;
