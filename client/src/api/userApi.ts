import { PostType, UserType } from "@/lib/types";
import { apiClient } from "./baseQuery";

// get user
export const getUser = async (userId: string | undefined) => {
  const response = await apiClient.query({
    url: `/user/info/${userId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response?.error?.data);
  }

  return response.data as UserType;
};

// edit user info
export const editUserInfo = async (data: FormData) => {
  const response = await apiClient.query({
    url: "/user/edit",
    method: "PATCH",
    data,
  });
  if (response.error) {
    throw new Error(response?.error.data);
  }

  return response.data;
};

// sidebar info
export const homeSidebarInfo = async () => {
  const response = await apiClient.query({
    url: "/user/home-sidebar",
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as {
    data: {
      posts: PostType[];
      mostFollowedTags: {
        createdAt: string;
        id: string;
        name: string;
        postCount: number;
      }[];
    };
  };
};
// delete user
export const deleteUser = async ({ password }: { password: string }) => {
  const response = await apiClient.query({
    url: "/user/delete",
    method: "POST",
    data: { password },
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

// add reading history
export const addHistory = async ({ postId }: { postId: string }) => {
  const response = await apiClient.query({
    url: `/user/add-history`,
    method: "POST",
    data: { postId },
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

// get reading history
export const getHistory = async () => {
  const response = await apiClient.query({
    url: `/user/get-history`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as PostType[];
};

// get user about
export const getAbout = async () => {
  const response = await apiClient.query({
    url: `/user/get-about`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { about: string } | undefined;
};

// add user about
export const addAbout = async (about: string) => {
  const response = await apiClient.query({
    url: `/user/add-about`,
    method: "POST",
    data: { about },
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};
