import { PostType } from "@/lib/types";
import { apiClient } from "./baseQuery";

// create post
export const createPost = async (data: FormData) => {
  const response = await apiClient.query({
    url: "/post/create",
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error.data);
  }
  return response.data;
};

// get latest post
export const latestPosts = async (cursor: string | null) => {
  const response = await apiClient.query({
    url: `/post/latest?cursor=${cursor}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data as { nextCursor: string | null; posts: PostType[] };
};

// get followed people post
export const followingPosts = async (cursor: string | null) => {
  const response = await apiClient.query({
    url: `/post/following?cursor=${cursor}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data as { nextCursor: string | null; posts: PostType[] };
};

// get  followed tag posts
export const tagPosts = async (cursor: string | null, value: string) => {
  const response = await apiClient.query({
    url: `/post/tag?tag=${value}&cursor=${cursor}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data as { nextCursor: string | null; posts: PostType[] };
};

// get user posts
export const getUserPosts = async ({
  userId,
  cursor,
}: {
  userId: string | undefined;
  cursor: string | null;
}) => {
  const response = await apiClient.query({
    url: `/post/user-posts/${userId}?cursor=${cursor}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }

  return response.data as { nextCursor: string | null; posts: PostType[] };
};

// get user saved posts
export const getSavedPosts = async (cursor: string | null) => {
  const response = await apiClient.query({
    url: `/post/saved-posts?cursor=${cursor}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }

  return response.data as { nextCursor: string | null; posts: PostType[] };
};

// get single post
export const getPost = async (postId: string | undefined) => {
  const response = await apiClient.query({
    url: `/post/single-post/${postId}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as PostType;
};

// delete post
export const deletePost = async (postId: string) => {
  const response = await apiClient.query({
    url: "/post/delete",
    method: "DELETE",
    data: { postId },
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

// like post
export const likePost = async (postId: string | undefined) => {
  const response = await apiClient.query({
    url: `/post/like-post/${postId}`,
    method: "POST",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

// get post stats
export const postStats = async (postId: string | undefined) => {
  const response = await apiClient.query({
    url: `/post/stats/${postId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as {
    totalClaps: number;
    totalComments: number;
    isSavedByUser: boolean;
  };
};
