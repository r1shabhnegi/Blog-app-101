import axios from "axios";
import {
  signupType,
  SigninType,
  EditUserInfoType,
} from "../../../common-types/index";
import { apiClient } from "./baseQuery";
import {
  commentServerResponse,
  FiveFollowingType,
  GetFollowersType,
  PostType,
  UserType,
} from "@/lib/types";

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
  const response = await apiClient.query({
    url: `/user/${userId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response?.error?.data);
  }

  return response.data as UserType;
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

  return response.data as PostType[];
};

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

export const bookmark = async (postId: string | undefined) => {
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

export const isBookmarked = async (postId: string | undefined) => {
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

export const getPost = async (postId: string | undefined) => {
  const response = await apiClient.query({
    url: `/post/get/${postId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as PostType;
};

export const allLatestPost = async (page: number) => {
  const response = await apiClient.query({
    url: `/post/all/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as PostType[];
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

export const followerCount = async (userId: string | undefined) => {
  const response = await apiClient.query({
    url: `/follow/followers-count/${userId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { followerCount: number };
};

export const fiveFollowing = async (userId: string | undefined) => {
  const response = await apiClient.query({
    url: `/follow/get/five-following/${userId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as FiveFollowingType[];
};

export const getHistoryPost = async () => {
  const response = await apiClient.query({
    url: `/post/reading-history`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as PostType[];
};

export const countHistoryPost = async () => {
  const response = await apiClient.query({
    url: `/user/get/countReadingHistory`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { count: number };
};

export const getFollowers = async ({
  userId,
  page,
}: {
  userId: string | undefined;
  page: number | undefined;
}) => {
  const response = await apiClient.query({
    url: `/follow/followers/${userId}/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as GetFollowersType[];
};

export const getAbout = async () => {
  const response = await apiClient.query({
    url: `/user/get/about`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { about: string } | undefined;
};

export const addAbout = async (about: string) => {
  const response = await apiClient.query({
    url: `/user/about`,
    method: "POST",
    data: { about },
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const getFollowings = async (userId: string | undefined) => {
  const response = await apiClient.query({
    url: `/follow/followings/${userId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const getTag = async ({
  name,
  page,
}: {
  name: string | undefined;
  page: number;
}) => {
  const response = await apiClient.query({
    url: `/tag/get/${name}/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { countTagPosts: number; posts: PostType[] };
};

export const tagNames = async () => {
  const response = await apiClient.query({
    url: `/tag/names`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as {
    id: string;
    name: string;
  }[];
};

export const getSavedPosts = async (page: number) => {
  const response = await apiClient.query({
    url: `/user/get/saved-post/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as {
    countSaved: number;
    savedPosts: PostType[];
  };
};

export const postStats = async (postId: string | undefined) => {
  const response = await apiClient.query({
    url: `/post/get/stats/${postId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { totalClaps: number; totalComments: number };
};

export const likePost = async (postId: string | undefined) => {
  const response = await apiClient.query({
    url: `/post/likePost/${postId}`,
    method: "POST",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const createComment = async (data: {
  postId: string | undefined;
  content: string;
}) => {
  const response = await apiClient.query({
    url: `/comment`,
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

export const getComments = async ({
  postId,
  page,
}: {
  postId: string | undefined;
  page: number;
}) => {
  const response = await apiClient.query({
    url: `/comment/${postId}/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as commentServerResponse;
};

export const fiveSavedPost = async () => {
  const response = await apiClient.query({
    url: "/post/get/five/posts",
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as {
    data: { id: string; createdAt: string; readTime: string; title: string }[];
  };
};

export const followingPosts = async (page: number | undefined) => {
  const response = await apiClient.query({
    url: `/post/followingUserPosts/get/${page}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as { data: { posts: PostType[]; numberOfPosts: number } };
};
