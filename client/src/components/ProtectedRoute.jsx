import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useSelector(
    (state) => state.auth
  );

  if(loading){
    return <h1>loading...</h1>
  }

  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/home" replace />;
};

export default ProtectedRoute;