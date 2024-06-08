import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import NavLayout from "./NavLayout";
import { useEffect } from "react";
import { setLoading } from "@/redux/authSlice";
import Loader from "@/components/Loader";

const AuthLayout = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return !isLoading ? (
    isAuth ? (
      <NavLayout>
        <Outlet />
      </NavLayout>
    ) : (
      <Navigate to='/' />
    )
  ) : (
    <Loader />
  );
};
export default AuthLayout;
