import { createEntityAdapter } from "@reduxjs/toolkit";
import { rootApi } from "./rootApi";
export const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id,
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
});

const initialState = postsAdapter.getInitialState();

// { ids: [], entities: []}

/*
 Entity Adapter giup quan ly du lieu o ngay trong redux va 
 no se giup chuan hoa du lieu theo dang
 {
  ids: [1, 3], entities: [{id: 1, content: '123'},{id: 3, content: 'abc'}]
 }
  cung cap them cho chung ta cac methods de de dang cap nhat xoa sua du lieu ma da duoc chuan hoa o phia tren
  no se giup chung ta chuan hoa du lieu + tranh bi trung lap du lieu. va lam cho ung dung cua chung ta se 
  luu tru du lieu tap trung, thay vi phai tao ra cac state nhu posts (useLazyLoadPost). luon luon chi 
  co 1 nguon du lieu duy nhat hay con goi la single source of truth 
*/

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

          // data đang có trong store => update data trong adpater
          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              postsAdapter.addOne(draft, newPost);
            }),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                postsAdapter.removeOne(draft, tempId);
                postsAdapter.addOne(draft, data);
              }),
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
        // chuẩn hóa sang entity trong redux
        transformResponse: (response) => {
          // response là cái gì trả về từ api
          // đẩy vào adapter
          return postsAdapter.upsertMany(initialState, response);
        },
        serializeQueryArgs: () => "allPosts",
        merge: (currentCache, newItems) => {
          // gop du lieu tu request truoc do + voi du lieu moi sau nay, no luon dam bao (entity adapter)
          // du lieu se ko bi duplicate boi vi no da co 1 he thong cac ids duy nhat
          return postsAdapter.upsertMany(currentCache, newItems.entities);
        },
        providesTags: [{ type: "POSTS" }],
      }),
      likePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: "POST",
          };
        },
        // fake update ngay lập tức mà k cần loading khi like
        // query các bài post đang được cache => tìm bài đang lik => update lại arraylike
        onQueryStarted: async (
          args, // là cái postId luôn
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();
          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.entities[args];
              if (currentPost) {
                currentPost.likes.push({
                  author: {
                    _id: store.auth.userInfo._id,
                    fullName: store.auth.userInfo.fullName,
                  },
                  _id: tempId,
                });
              }
            }),
          );

          try {
            const { data } = await queryFulfilled;

            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                const currentPost = draft.entities[args];
                if (currentPost) {
                  currentPost.likes = currentPost.likes.map((like) => {
                    if (like._id === tempId) {
                      return {
                        author: {
                          _id: store.auth.userInfo._id,
                          fullName: store.auth.userInfo.fullName,
                        },
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        _id: data._id,
                      };
                    }

                    return like;
                  });
                }
              }),
            );
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
      }),
      unlikePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/unlike`,
            method: "DELETE",
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.entities[args];
              if (currentPost) {
                currentPost.likes = currentPost.likes.filter(
                  (like) => like.author._id !== store.auth.userInfo._id,
                );
              }
            }),
          );

          try {
            await queryFulfilled;
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
      }),
      createComment: builder.mutation({
        query: ({ postId, comment }) => {
          return {
            url: `/posts/${postId}/comments`,
            method: "POST",
            body: { comment },
          };
        },
        onQueryStarted: async (
          params,
          { dispatch, queryFulfilled, getState },
        ) => {
          const tempId = crypto.randomUUID();
          const store = getState();

          const optimisticComment = {
            _id: tempId,
            comment: params.comment,
            author: {
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.entities[params.postId];

              if (currentPost) {
                currentPost.comments.push(optimisticComment);
              }
            }),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                const currentPost = draft.entities[params.postId];
                if (currentPost) {
                  const commentIndex = currentPost.comments.findIndex(
                    (comment) => comment._id === tempId,
                  );

                  if (commentIndex !== -1) {
                    currentPost.comments[commentIndex] = data;
                  }
                }
              }),
            );
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
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
