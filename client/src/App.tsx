import { lazy, Suspense } from "react";

import { useQuery } from "@tanstack/react-query";
import { serverStatus } from "./api";
import { refreshToken } from "./api/authApi";
import ServerDown from "./pages/ServerDown";
import Loader from "./components/Loader";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hook";
import { setUserCredentials } from "./redux/authSlice";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
// import ProfileLayout from "./layout/ProfileLayout";
import ProfileHome from "./pages/ProfileHome";
import ProfileLists from "./pages/ProfileLists";
import Feed from "./pages/Feed";
import MainLayout from "./layout/MainLayout";

const ProfileLayout = lazy(() => import("./layout/ProfileLayout"));
const ProfileAbout = lazy(() => import("./pages/ProfileAbout"));
const ReadingHistory = lazy(() => import("./pages/ReadingHistory"));
const Settings = lazy(() => import("./pages/Settings"));
const Publish = lazy(() => import("./pages/Publish"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Followers = lazy(() => import("./pages/Followers"));
const Tag = lazy(() => import("./pages/Tag"));
const TagSuggestions = lazy(() => import("./pages/TagSuggestions"));

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
  }, [isUserLoggedIn, dispatch, userData]);

  if (loadingServerStatus || refreshTokenPending) return <Loader />;
  if (isServerError) return <ServerDown />;

  return (
    <Suspense>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<MainLayout />}>
            <Route
              path='/'
              element={<Feed />}
            />
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
              path='/settings/:userId'
              element={<Settings />}
            />
            <Route
              path='/followers/:userId'
              element={<Followers />}
            />
            <Route
              path='/post/:postId'
              element={<PostDetail />}
            />
            <Route
              path='/tag/:name'
              element={<Tag />}
            />
            <Route
              path='/publish'
              element={<Publish />}
            />
            <Route
              path='/tag-suggestions'
              element={<TagSuggestions />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
export default App;
