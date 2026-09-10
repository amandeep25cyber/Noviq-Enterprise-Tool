import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UsersRound,
  BarChart3,
  CreditCard,
  Settings,
  MessageSquare,
  FileText,
  CheckSquare,
  Calendar,
  User,
  ClipboardList,
} from "lucide-react";
import toolLogo from "../../assets/logo.png";
import blackTextToolName from "../../assets/blackTextToolName.png"

const adminNav = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "User Management", icon: Users, path: "/admin/users" },
  { name: "Projects", icon: FolderKanban, path: "/admin/projects" },
  { name: "Teams", icon: UsersRound, path: "/admin/teams" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Billing", icon: CreditCard, path: "/admin/billing" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

const managerNav = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/manager" },
  { name: "My Projects", icon: FolderKanban, path: "/manager/projects" },
  { name: "Task Board", icon: CheckSquare, path: "/manager/tasks" },
  { name: "Team Members", icon: UsersRound, path: "/manager/team" },
  { name: "Chat", icon: MessageSquare, path: "/manager/chat" },
  { name: "Reports", icon: ClipboardList, path: "/manager/reports" },
  { name: "Settings", icon: Settings, path: "/manager/settings" },
];

const memberNav = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/member" },
  { name: "My Tasks", icon: CheckSquare, path: "/member/tasks" },
  { name: "Chat", icon: MessageSquare, path: "/member/chat" },
  { name: "Files", icon: FileText, path: "/member/files" },
  { name: "Calendar", icon: Calendar, path: "/member/calendar" },
  { name: "Profile", icon: User, path: "/member/profile" },
];

const Sidebar=({ role })=>{
  const location = useLocation();
  const navItems = role === "admin" ? adminNav : role === "manager" ? managerNav : memberNav;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex select-none items-center justify-center gap-0.5">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={toolLogo} alt="Tool Logo" className="w-full rounded-lg" />
          </div>
          <span className="font-sans font-extrabold mb-1 text-2xl text-gray-800 uppercase">oviq</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {role === "admin" ? "Admin Account" : role === "manager" ? "Project Manager" : "Team Member"}
          </p>
          <p className="text-xs text-gray-600">
            {role === "admin" ? "Full system access" : role === "manager" ? "Manage projects & teams" : "View & update tasks"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar