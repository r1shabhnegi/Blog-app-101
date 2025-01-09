import { useQuery } from "@tanstack/react-query";
import { serverStatus } from "./api";
import { refreshToken } from "./api/AuthApi";
import ServerDown from "./pages/ServerDown";
import Loader from "./components/Loader";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hook";
import { setUserCredentials } from "./redux/authSlice";

import { Routes, Route } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import MainPageLayout from "./layout/MainPageLayout";
import ProfileLayout from "./layout/ProfileLayout";
import ProfileHome from "./pages/ProfileHome";
import ProfileLists from "./pages/ProfileLists";
import ProfileAbout from "./pages/ProfileAbout";
import ReadingHistory from "./pages/ReadingHistory";
import Settings from "./pages/Settings";
import PublishLayout from "./layout/PublishLayout";
import Publish from "./pages/Publish";
import PostDetail from "./pages/PostDetail";
import HomeLatest from "./pages/HomeLatest";
import HomeLayout from "./layout/HomeLayout";
import HomeFollowing from "./pages/HomeFollowing";
import Followers from "./pages/Followers";
import Followings from "./pages/Followings";
import NoSidebarLayout from "./layout/NoSidebarLayout";
import Tag from "./pages/Tag";

const App = () => {
  const dispatch = useAppDispatch();

  const { isPending: loadingServerStatus, isError: isServerError } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: serverStatus,
  });

  const {
    data: userData,
    isSuccess: isUserLoggedIn,
    isPending: refreshTokenPending,
  } = useQuery({
    queryKey: ["refreshToken"],
    queryFn: refreshToken,
    retry: false,
  });

  useEffect(() => {
    if (isUserLoggedIn) {
      dispatch(setUserCredentials(userData));
    }
  }, [isUserLoggedIn]);

  if (loadingServerStatus || refreshTokenPending) return <Loader />;
  if (isServerError) return <ServerDown />;

  return (
    <Routes>
      <Route element={<MainPageLayout />}>
        <Route element={<HomeLayout />}>
          <Route
            path='/'
            index
            element={<HomeLatest />}
          />
          <Route
            path='/feed-following'
            index
            element={<HomeFollowing />}
          />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route element={<ProfileLayout />}>
          <Route
            path='/profile/:userId'
            element={<ProfileHome />}
          />
          <Route
            path='/profile/lists/:userId'
            element={<ProfileLists />}
          />
          <Route
            path='/profile/about/:userId'
            element={<ProfileAbout />}
          />
        </Route>
        <Route
          path='/reading-history/:userId'
          element={<ReadingHistory />}
        />
        <Route
          path='/settings'
          element={<Settings />}
        />
        <Route
          path='/followers/:userId'
          element={<Followers />}
        />
        <Route
          path='/followings/:userId'
          element={<Followings />}
        />
      </Route>

      <Route element={<NoSidebarLayout />}>
        <Route
          path='/post/:postId'
          element={<PostDetail />}
        />
        <Route
          path='/tag/:name'
          element={<Tag />}
        />
      </Route>
      <Route element={<PublishLayout />}>
        <Route
          path='/publish'
          element={<Publish />}
        />
      </Route>
    </Routes>
  );
};
export default App;
