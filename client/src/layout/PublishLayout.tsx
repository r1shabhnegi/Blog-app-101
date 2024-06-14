import PublishPageNav from "@/components/PublishPageNav";
import { setLoading } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublishLayout = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return !isLoading ? isAuth ? <Outlet /> : <Navigate to='/' /> : <Loader />;
};
export default PublishLayout;
