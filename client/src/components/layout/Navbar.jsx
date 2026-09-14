import { Search, Bell, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from "../../services/auth.services";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { toast } from "react-toastify";
import { deleteOrganisation } from "../../store/features/orgSlice";

const Navbar=({ role })=> {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector(state=>state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        showDropdown &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
        ) {
          setShowDropdown(false);
        }
      };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  const handleLogout = async()=>{
    try {
      const res = await userLogout();
      toast.success(res.data.message)
      dispatch(logout());
      dispatch(deleteOrganisation());
      navigate('/',{ replace: true});

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, people..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-6">
        <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div
          className="relative"
          ref={modalRef}
           >
          <button
            onClick={()=>setShowDropdown((prev)=>!prev)}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 pr-3 rounded-xl transition-colors hover:cursor-pointer"
          >
            <div className="w-9 h-9 bg-linear-to-br from-blue-300 via-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-md border border-gray-300">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {user?.name?.split(" ")
                      .map((n) => n[0].toUpperCase())
                      .join("")}
                  </span>
                )}
              </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          {showDropdown && (
            <div
            className="absolute right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 mt-3">
              <Link
                onClick={()=>setShowDropdown(false)}
                to={role === "member" ? "/member/profile" : `/${role}/settings`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile Settings
              </Link>
              <button
                onClick={()=>{handleLogout(); setShowDropdown(false)}}
                className="w-full text-start block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
