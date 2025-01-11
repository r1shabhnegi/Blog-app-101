import { SigninType, SignupType } from "@/lib/types";
import { apiClient } from "./baseQuery";

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

export const signup = async (data: SignupType) => {
  // try {
  const response = await apiClient.query({
    url: "/auth/create",
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

export const googleAuth = async (code: any) => {
  const response = await apiClient.query({
    url: `/googleLogin?code=${code}`,
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response.data;
};
