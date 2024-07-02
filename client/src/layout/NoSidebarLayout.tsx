import { setLoading } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "@/components/Header";

const NoSidebarLayout = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);
  return !isLoading ? (
    isAuth ? (
      <div className='flex flex-col'>
        <Header />
        <Outlet />
      </div>
    ) : (
      <Navigate to='/' />
    )
  ) : (
    <Loader />
  );
};
export default NoSidebarLayout;
