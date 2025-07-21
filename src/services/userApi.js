import { rootApi } from "./rootApi";

export const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserInfoById: builder.query({
        query: (id) => `/users/${id}`,
        providesTags: (result) => [
          { type: "GET_USER_INFO_BY_ID", id: result._id },
        ],
      }),
    };
  },
});

export const { useGetUserInfoByIdQuery } = userApi;
