import axios, { AxiosError } from "axios";
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
  return response;
};

export const refreshToken = async () => {
  const response = await apiClient.query({
    url: "/auth",
    method: "GET",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response;
};

export const logout = async () => {
  const response = await apiClient.query({
    url: "/auth/logout",
    method: "POST",
  });
  if (response.error) {
    throw new Error(response?.error?.data);
  }
  return response;
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

  return response;
};

export const aiAuto = async (data) => {
  const response = await apiClient.query({
    url: "/ai-auto",
    method: "POST",
    data,
  });
  if (response.error) {
    throw new Error(response?.error.data);
  }

  return response;
};
