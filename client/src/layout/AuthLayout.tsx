import Landing from "@/pages/Landing";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { setLoading } from "@/redux/authSlice";
import { Loader } from "lucide-react";
import { Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AuthLayout = () => {
  //oauth

  const GoogleAuthWrapper = () => {
    const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <Landing />
      </GoogleOAuthProvider>
    );
  };

  const dispatch = useAppDispatch();
  const { isLoading, isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(false));
  }, []);

  return isLoading ? <Loader /> : isAuth ? <Outlet /> : <GoogleAuthWrapper />;
};
export default AuthLayout;
