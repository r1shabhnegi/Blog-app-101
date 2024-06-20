import axios, { AxiosError, AxiosResponse } from "axios";
import { RootState, store } from "../redux/_store";
import { setLogout, setUserCredentials } from "@/redux/authSlice";

const getAuthHeaders = (accessToken: string | undefined) => {
  return accessToken ? { authorization: `Bearer ${accessToken}` } : {};
};

const handleError = async (
  error: AxiosError,
  BASE_URL: string
): Promise<AxiosError | null> => {
  if (error.response?.status === 401) {
    try {
      const response = await axios({
        url: `${BASE_URL}/auth`,
        withCredentials: true,
      });

      store.dispatch(setUserCredentials(response?.data));

      return null;
    } catch (refreshError) {
      store.dispatch(setLogout());
      return refreshError as AxiosError;
    }
  }
  return error;
};

type QueryParams = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown;
};
interface QueryResponse {
  data?: object;
  error?: {
    status?: number;
    data?: string | undefined;
  };
}

const baseQuery =
  (BASE_URL: string = `${import.meta.env.VITE_BACKEND_URL}/api/v1`) =>
  async ({ url, method, data }: QueryParams): Promise<QueryResponse> => {
    const accessToken = (store.getState() as RootState).auth.token;
    const headers = getAuthHeaders(accessToken);

    try {
      const response: AxiosResponse = await axios({
        url: `${BASE_URL}${url}`,
        method,
        data,
        headers,
        withCredentials: true,
      });

      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = await handleError(axiosError, BASE_URL);
      if (!response) {
        return baseQuery(BASE_URL)({ url, data, method });
      }
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.message,
        },
      };
    }
  };

export const apiClient = {
  query: baseQuery(),
};
