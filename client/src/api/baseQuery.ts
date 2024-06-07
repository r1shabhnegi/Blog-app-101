import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { RootState, store } from "../redux/_store";
import { setLogout, setUserCredentials } from "@/redux/authSlice";

const getAuthHeaders = (accessToken: string | null) => {
  return accessToken ? { authorization: `Bearer ${accessToken}` } : {};
};

const handleError = async (
  error: AxiosError,
  BASE_URL: string
): Promise<AxiosError | null> => {
  if (error.response?.status === 403) {
    try {
      const response = await axios.get(`${BASE_URL}/auth`, {
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
  data?: any;
};
interface QueryResponse {
  data?: any;
  error?: {
    status?: number;
    data?: any;
  };
}

const baseQuery =
  (BASE_URL: string = `${import.meta.env.VITE_BACKEND_URL}/api/v1`) =>
  async ({ url, method, data }: QueryParams): Promise<QueryResponse> => {
    const accessToken = (store.getState() as RootState).auth.token;
    const headers = getAuthHeaders(accessToken);

    try {
      const config: AxiosRequestConfig = await axios({
        url: `${BASE_URL}${url}`,
        method,
        data,
        headers,
      });
      const response: AxiosResponse = await axios(config);

      return response.data;
    } catch (error: any) {
      const response = await handleError(error, BASE_URL);
      if (!response) {
        return baseQuery(BASE_URL)({ url, data, method });
      }
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };

export const apiClient = {
  query: baseQuery(),
};
