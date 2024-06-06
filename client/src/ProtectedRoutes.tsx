import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuth = false;
  return isAuth ? <Outlet /> : <Navigate to='/' />;
};
export default ProtectedRoutes;
