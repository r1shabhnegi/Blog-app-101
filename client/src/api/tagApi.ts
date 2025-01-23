import { apiClient } from "./baseQuery";

// top suggestions to follow
export const tagSuggestions = async () => {
  const response = await apiClient.query({
    url: `/tag/suggestions`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as {
    id: string;
    name: string;
    _count: {
      posts: number;
      followers: number;
    };
  }[];
};

// handle follow tag
export const followTag = async (tagId: string) => {
  const response = await apiClient.query({
    url: `/tag/follow-tag/${tagId}`,
    method: "POST",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data;
};

// check tag follow

export const checkTagFollow = async (tagId: string) => {
  const response = await apiClient.query({
    url: `/tag/check-follow/${tagId}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { isFollow: boolean };
};

// get followed tags name
export const getFollowedTags = async () => {
  const response = await apiClient.query({
    url: `/tag/followed-tags`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as { name: string }[];
};

// get tag details
export const getTagDetail = async (name: string | undefined) => {
  const response = await apiClient.query({
    url: `/tag/detail/${name}`,
    method: "GET",
  });

  if (response.error) {
    throw new Error(response.error.data);
  }
  return response.data as {
    name: string;
    id: string;
    _count: {
      posts: number;
      followers: number;
    };
  };
};
