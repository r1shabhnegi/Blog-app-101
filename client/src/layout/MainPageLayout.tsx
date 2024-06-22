import Landing from "@/pages/Landing";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import NavLayout from "./NavLayout";
import { useEffect } from "react";
import { setLoading } from "@/redux/authSlice";
import { Loader } from "lucide-react";
import HomeLatest from "@/pages/HomeLatest";
import { Outlet } from "react-router-dom";

const MainPageLayout = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return !isLoading ? (
    isAuth ? (
      // <NavLayout>
      //   <HomeLatest />
      // </NavLayout>
      <Outlet />
    ) : (
      <Landing />
    )
  ) : (
    <Loader />
  );
};
export default MainPageLayout;
