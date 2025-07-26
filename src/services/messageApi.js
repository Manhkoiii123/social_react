import { rootApi } from "./rootApi";

export const messageApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getConservations: builder.query({
      query: () => "/messages/conversations",
      providesTags: ["CONVERSATIONS"],
    }),
    getMessages: builder.query({
      query: ({ userId, offset, limit }) => ({
        url: "/messages",
        params: { userId, offset, limit },
      }),
      keepUnusedDataFor: 0,
      serializeQueryArgs: ({ queryArgs }) => ({ userId: queryArgs.userId }),
      providesTags: (result, error, { userId }) => {
        return [{ type: "MESSAGES", id: userId }];
      },
    }),
    sendMessage: builder.mutation({
      query: ({ message, receiver }) => ({
        url: "/messages/create",
        method: "POST",
        body: { message, receiver },
      }),
    }),
    markConversationAsSeen: builder.mutation({
      query: (sender) => ({
        url: "/messages/update-seen",
        method: "PUT",
        body: { sender },
      }),
      invalidatesTags: ["CONVERSATIONS"],
    }),
  }),
});
export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationAsSeenMutation,
} = messageApi;
