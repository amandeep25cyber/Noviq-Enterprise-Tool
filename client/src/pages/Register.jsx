import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { userRegister } from "../services/auth.services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/features/authSlice";
import logo from "../assets/logo.png";

const Register =()=> {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [orgName,setOrgName] = useState("");
  const [enableBtn,setEnableBtn] = useState(false);
  const [terms,setTerms] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{

    if(![name,email,password,orgName].some(field=> !field || field.trim()==="") && terms){
      setEnableBtn(true);
    }else setEnableBtn(false)

  },[name,email,password,orgName,terms])

  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
      const data = await userRegister({name,email,password,organisationName:orgName});

      dispatch(loginSuccess(data.data.user))
      toast.success(data.message);
      
      setEmail("");
      setName("");
      setOrgName("");
      setPassword("");
      setTerms(false);
      navigate("/")

    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white select-none rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
              <img src={logo} alt="Tool Logo" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Your Organisation</h1>
          <p className="text-center text-gray-600 mb-8">Get started with TaskManager today</p>

          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  onChange={(e)=>setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  onChange={(e)=>setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organisation Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  onChange={(e)=>setOrgName(e.target.value)}
                  value={orgName}
                  type="text"
                  placeholder="Enter name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>            

            <label className="flex items-start">
              <input onChange={(e)=>setTerms(e.target.checked)} checked={terms} type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1" />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
              </span>
            </label>

            <button 
              disabled = {!enableBtn}
              className={`w-full text-white py-3 rounded-xl font-medium ${enableBtn? "bg-blue-600 hover:bg-blue-700 transition-colors" : "bg-blue-500 cursor-not-allowed"}`}>
              Create Organisation
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;