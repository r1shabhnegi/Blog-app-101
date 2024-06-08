import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import NavLayout from "./NavLayout";
import { useEffect } from "react";
import { setLoading } from "@/redux/authSlice";
import { Loader } from "lucide-react";

const MainPageLayout = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return !isLoading ? (
    isAuth ? (
      <NavLayout>
        <Home />
      </NavLayout>
    ) : (
      <Landing />
    )
  ) : (
    <Loader />
  );
};
export default MainPageLayout;
