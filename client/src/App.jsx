import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardRedirect from "./pages/DashboardRedirect";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/member/EmployeeDashboard";
import { ToastContainer } from "react-toastify"
import { getCurrentUser } from "./services/auth.services.js"
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyTasks from "./pages/member/MyTasks.jsx"
import Chat from "./pages/member/Chat.jsx"
import Files from "./pages/member/Files.jsx"
import Calendar from "./pages/member/Calendar.jsx"
import Profile from "./pages/member/Profile.jsx"
import MyProjects from "./pages/manager/MyProjects.jsx"
import Chats from "./pages/manager/Chats.jsx"
import Reports from "./pages/manager/Reports.jsx"
import Settings from "./pages/manager/Settings.jsx"
import TaskBoard from "./pages/manager/TaskBoard.jsx"
import TeamMembers from "./pages/manager/TeamMembers.jsx"
import Analytics from "./pages/admin/Analytics.jsx"
import Billing from "./pages/admin/Billing.jsx"
import Projects from "./pages/admin/Projects.jsx"
import Setting from "./pages/admin/Settings.jsx"
import Teams from "./pages/admin/Teams.jsx"
import UserManagement from "./pages/admin/UserManagement.jsx"
import ProjectDetail from "./components/ProjectDetail.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const App = () => {
  const dispatch = useDispatch();

  const {user} = useSelector(state=>state.auth);

  const role = user?.role;
  
  useEffect(() => {
    getCurrentUser(dispatch);
  }, []);

  

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout role={role}/>}>
          <Route index element={<DashboardRedirect role={role}/>} />
          
          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              role === "admin" ? (
                <Outlet />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          >
            <Route index element={<AdminDashboard/>}/>
            <Route path="users" element={<UserManagement/>} />
            <Route path="projects" element={<Projects/>} />
            <Route path="teams" element={<Teams/>} />
            <Route path="analytics" element={<Analytics/>} />
            <Route path="billing" element={<Billing/>} />
            <Route path="settings" element={<Setting/>} />
            <Route path="project/:id" element={<ProjectDetail role={role}/>}/>
          </Route>

          {/* Manager Routes */}
          <Route
            path="manager"
            element={
              role === "manager" ? (
                <Outlet />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          >
            <Route index element={<ManagerDashboard/>} />
            <Route path="projects" element={<MyProjects/>}/> 
            <Route path="tasks" element={<TaskBoard/>}/> 
            <Route path="team" element={<TeamMembers/>}/> 
            <Route path="chat" element={<Chats/>}/> 
            <Route path="reports" element={<Reports/>}/> 
            <Route path="settings" element={<Settings/>}/> 
            <Route path="project/:id" element={<ProjectDetail role={role}/>}/> 
          </Route>

          {/* Member Routes */}
          <Route
            path="member"
            element={
              role === "member" ? (
                <Outlet/>
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="tasks" element={<MyTasks/>}/>
            <Route path="chat" element={<Chat/>}/>
            <Route path="files" element={<Files/>}/>
            <Route path="calendar" element={<Calendar/>}/>
            <Route path="profile" element={<Profile/>} />
          </Route>

        </Route>
       </Route>
        
        {/* Unprotected Routes */}
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </>
  );
};

export default App;
