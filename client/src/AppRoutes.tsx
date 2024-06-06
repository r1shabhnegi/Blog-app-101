import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./ProtectedRoutes";
import Profile from "./pages/Profile";
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path='/'
        index
        element={<Home />}
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path='/profile'
          element={<Profile />}
        />
      </Route>

      <Route
        path='/signin'
        element={<Signin />}
      />
      <Route
        path='/signup'
        element={<Signup />}
      />
    </Routes>
  );
};
export default AppRoutes;
