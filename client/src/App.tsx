import { useQuery } from "@tanstack/react-query";
import { refreshToken, serverStatus } from "./api";
import ServerDown from "./pages/ServerDown";
import Loader from "./components/Loader";
import AppRoutes from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hook";
import { setUserCredentials } from "./redux/authSlice";

const App = () => {
  const dispatch = useAppDispatch();

  const { isPending: loadingServerStatus, isError: isServerError } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: serverStatus,
  });

  const {
    data,
    isSuccess,
    isPending: refreshTokenPending,
  } = useQuery({
    queryKey: ["refreshToken"],
    queryFn: refreshToken,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserCredentials(data));
    }
  }, [data, dispatch, isSuccess]);

  if (isServerError) return <ServerDown />;
  if (loadingServerStatus || refreshTokenPending) return <Loader />;

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
};
export default App;
