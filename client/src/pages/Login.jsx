import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { userLogin } from "../services/auth.services.js";
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess } from "../store/features/authSlice.js";
import { useNavigate } from "react-router-dom";
import { storeOrganisation } from "../store/features/orgSlice.js"
import logo from "../assets/logo.png";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("member");
  const [islogin,setIsLogin] = useState(false);
  const { isLoggedIn,user } = useSelector(state=>state.auth);

  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
      setIsLogin(true);
      const data = await userLogin({email,password,role});

      if(data.success){
        dispatch(loginSuccess(data.data?.user))
        dispatch(storeOrganisation(data.data?.organisation))
        toast.success(data.message)
        navigate('/')
      }
      setEmail("");
      setPassword("");

      
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }finally{
      setIsLogin(false);
    } 
  }

  useEffect(()=>{
    if(isLoggedIn && user){
      navigate("/",{
        replace:true
      });
    }
  },[isLoggedIn,user])

  const isValidField = [email,password,role].every(field=>field.trim()!=="");
  

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white select-none rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
              <img src={logo} alt="Tool logo" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account to continue
          </p>

          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  onChange={(e)=>setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select 
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="member">Team Member</option>
                <option value="manager">Project Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <div className="space-y-3">
                <button 
                  disabled = {islogin || !isValidField}
                  className={`w-full text-white py-3 rounded-xl font-medium  ${(islogin || !isValidField)? "cursor-not-allowed bg-purple-500 hover:bg-purple-600": "bg-purple-600 cursor-pointer hover:bg-purple-700 transition-colors"}`}>
                    {
                      islogin? "Signing..":"Sign In"
                    }
                </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your own company
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
