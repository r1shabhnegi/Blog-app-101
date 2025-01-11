import { PostType } from "@/lib/types";
import { apiClient } from "./baseQuery";

export const latestPosts = async (cursor: string | null) => {
  const response = await apiClient.query({
    url: `/post/latest?cursor=${cursor}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data as { nextCursor: string | null; result: PostType[] };
};
export const followingPosts = async (cursor: string | null) => {
  const response = await apiClient.query({
    url: `/post/following?cursor=${cursor}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data as { nextCursor: string | null; result: PostType[] };
};
export const tagPosts = async (cursor: string | null, tag: string) => {
  const response = await apiClient.query({
    url: `/post/tag?cursor=${cursor}?tag=${tag}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data as PostType[];
};
