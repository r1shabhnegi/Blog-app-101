import axios from "axios";
import {
  signupType,
  SigninType,
  EditUserInfoType,
} from "../../../common-types/index";
import { apiClient } from "./baseQuery";

export const serverStatus = async () => {
  const response = await axios.get(import.meta.env.VITE_BACKEND_URL);
  return response;
};

export const signup = async (data: signupType) => {
  const response = await apiClient.query({
    url: "/user",
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response;
};

export const signin = async (data: SigninType) => {
  const response = await apiClient.query({
    url: "/auth",
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.query({
    url: "/auth",
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.query({
    url: "/auth/logout",
    method: "POST",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data;
};

export const editUserInfo = async (data: EditUserInfoType) => {
  const response = await apiClient.query({
    url: "/user",
    method: "PATCH",
    data,
  });
  if (response.error) {
    throw new Error(response?.error.data);
  }

  return response.data;
};

export const createPost = async (data: FormData) => {
  const response = await apiClient.query({
    url: "/post",
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error.data);
  }
  return response.data;
};

export const getUser = async (userId: string | undefined) => {
  console.log(userId);
  const response = await apiClient.query({
    url: `/user/${userId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response?.error?.data);
  }

  return response.data;
};

export const getUserPosts = async ({
  userId,
  page,
}: {
  userId: string | undefined;
  page: number;
}) => {
  const response = await apiClient.query({
    url: `/post/${userId}/${page}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }

  return response.data;
};

export const deleteUser = async ({ password }: { password: string }) => {
  const response = await apiClient.query({
    url: "/user/delete",
    method: "POST",
    data: { password },
  });
  console.log({ password });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await apiClient.query({
    url: "/post",
    method: "DELETE",
    data: { postId },
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const bookmark = async (postId: string) => {
  const response = await apiClient.query({
    url: "/bookmark",
    method: "POST",
    data: { postId },
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const isBookmarked = async (postId: string) => {
  const response = await apiClient.query({
    url: `/bookmark/${postId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const addReadingHistory = async ({ postId }: { postId: string }) => {
  const response = await apiClient.query({
    url: `/user/reading-history`,
    method: "POST",
    data: { postId },
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const getPost = async ({ postId }: { postId: string | undefined }) => {
  const response = await apiClient.query({
    url: `/post/get/${postId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const allLatestPost = async (page: string) => {
  const response = await apiClient.query({
    url: `/post/all/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const followAndUnFollow = async (userId: string | undefined) => {
  const response = await apiClient.query({
    url: `/follow`,
    method: "POST",
    data: { userId },
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const checkFollow = async (userIdParam: string | undefined) => {
  const response = await apiClient.query({
    url: `/follow/${userIdParam}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};
