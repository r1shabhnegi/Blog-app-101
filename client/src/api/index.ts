import { apiClient } from "./baseQuery";
import {
  commentServerResponse,
  FiveFollowingType,
  GetFollowersType,
} from "@/lib/types";

export const serverStatus = async () => {
  const response = await apiClient.query({
    url: "/server",
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response;
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

export const getAiSummary = async (data: {
  text: string | TrustedHTML | undefined;
}) => {
  const response = await apiClient.query({
    url: `/ai/summary`,
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as { data: { text: string } };
};

export const getAskAi = async (data: { text: string }) => {
  const response = await apiClient.query({
    url: `/ai/ask-ai`,
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as { data: { text: string } };
};

export const extent = async (data: { text: string }) => {
  const response = await apiClient.query({
    url: `/ai/extend`,
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as { data: { text: string } };
};

export const countFollowing = async (userId: string | undefined) => {
  const response = await apiClient.query({
    url: `/follow/get/followingCount/${userId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response as { data: { followingCount: number } };
};
