import { Routes, Route } from "react-router-dom";

import AuthLayout from "@/layout/AuthLayout";
import Profile from "./pages/Profile";
import MainPageLayout from "./layout/MainPageLayout";
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path='/'
        index
        element={<MainPageLayout />}
      />
      <Route element={<AuthLayout />}>
        <Route
          path='/profile'
          element={<Profile />}
        />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
