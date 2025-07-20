import { rootApi } from "./rootApi";

export const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      createPost: builder.mutation({
        query: (formData) => {
          return {
            url: "/posts",
            method: "POST",
            body: formData,
          };
        },
        // mỗi khi craete được gọi => hàm này chạy ngay
        onQueryStarted: async (
          args, // form data có dữ liệu gì khi gửi lên khi create post
          // queryFulfilled là 1 promise đợi cho api có dữ liệu trả về => lấy được data trả về
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();
          // fake data trả về của api createPost
          const newPost = {
            _id: tempId,
            likes: [],
            comments: [],
            content: args.get("content"),
            author: {
              notifications: [],
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          // data đang có trong store => update data
          const patchResult = dispatch(
            rootApi.util.updateQueryData(
              "getPosts", // endpoint là getPosts
              { limit: 10, offset: 0 }, // params
              (draft) => {
                // draft là tượng trung cho danh sahcs bài post đang có trong redux
                draft.unshift(newPost);
              },
            ),
          );

          // dùng data thật từ api trả về => thay vào data nháp
          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData(
                "getPosts",
                { limit: 10, offset: 0 },
                (draft) => {
                  const index = draft.findIndex((post) => post._id === tempId);
                  if (index !== -1) {
                    draft[index] = data;
                  }
                },
              ),
            );
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
      }),
      getPosts: builder.query({
        query: ({ limit, offset } = {}) => {
          return {
            url: "/posts",
            params: { limit, offset },
          };
        },
        providesTags: [{ type: "POSTS" }],
      }),
    };
  },
});
export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useCreateCommentMutation,
} = postApi;
