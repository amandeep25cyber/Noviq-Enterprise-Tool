import { Navigate } from "react-router-dom";

function DashboardRedirect({role}) {


  if(role === "admin"){
    return <Navigate to="admin" />;
  }

  if(role === "manager"){
    return <Navigate to="manager" />;
  }

  if(role === "member"){
    return <Navigate to="member" />
  }

  return <Navigate to="/home" />;
}

export default DashboardRedirect;