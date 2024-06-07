import axios from "axios";
import { signupType, SigninType } from "../../../common-types/index";

const SERVER_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const serverStatus = async () => {
  const response = await axios.get(import.meta.env.VITE_BACKEND_URL);

  return response;
};

export const signup = async (data: signupType) => {
  const response = await axios.post(`${SERVER_URL}/user`, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.statusText) {
    throw new Error(response?.data.message);
  }
  return response.data;
};
export const signin = async (data: SigninType) => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("signin error");
  }
};

export const refreshToken = async () => {
  const response = await axios.get(`${SERVER_URL}/auth`, {
    withCredentials: true,
  });
  return response.data;
};
