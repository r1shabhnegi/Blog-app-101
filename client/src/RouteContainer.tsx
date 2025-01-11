import { Routes, Route } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import MainPageLayout from "./layout/AuthLayout";
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
import { GoogleOAuthProvider } from "@react-oauth/google";

const AppRoutes = () => {
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
export default AppRoutes;
