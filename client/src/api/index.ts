import axios from "axios";
import {
  signupType,
  SigninType,
  EditUserInfoType,
  PublishPostType,
} from "../../../common-types/index";
import { apiClient } from "./baseQuery";
import { UserType } from "@/lib/types";

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
