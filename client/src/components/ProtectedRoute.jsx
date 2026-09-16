import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ScreenLoader from "./layout/ScreenLoader.jsx";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useSelector(
    (state) => state.auth
  );

  if(loading){
    return <ScreenLoader />
  }

  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/home" replace />;
};

export default ProtectedRoute;