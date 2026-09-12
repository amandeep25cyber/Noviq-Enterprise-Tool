import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  X,
  Lock,
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";
import { getUserDetails } from "../../services/member.services";

const MemberProfile = () => {

    const [userData, setUserData] = useState({});

    useEffect(()=>{
        getUserData();
    },[])

    const getUserData = async() =>{
        try {
            const result = await getUserDetails();
            setUserData(result?.data);
            
        } catch (error) {
            console.log(error?.response?.data?.message);
            toast.error(error?.response?.data?.message);
        }
    }
    
    // --- MOCK DATA (Agar API se data aane me time lage, toh ye dikhega) ---
    

  // --- STATES FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'security'
  const modalRef = useRef(null);

  // Form States
  const [formData, setFormData] = useState({
    name: userData.name,
    phoneNo: userData.phoneNo,
    bio: userData.bio,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const handler = (e) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isModalOpen]);

  // --- HELPERS ---
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTenure = (dateString) => {
    const months = Math.floor(
      (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24 * 30),
    );
    return months > 0 ? `${months} Months` : "Less than a month";
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (activeTab === "general") {
      console.log("Updating Details & Avatar via API...", formData);
      // TODO: Call PUT /api/users/profile
    } else {
      console.log("Updating Password via API...", formData);
      // TODO: Call PUT /api/users/change-password
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      {/* --- HEADER --- */}
      <div className="mb-8 flex justify-between items-center">
        <div className="px-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage details and track workload
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20"
        >
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN (Sticky Profile & Stats) 
        ========================================================================= */}
        <div className="lg:col-span-4 sticky top-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              {/* Main Avatar Circle (Isme overflow-hidden hai) */}
              <div className="w-22 h-22 bg-linear-to-br from-blue-300 via-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-md border-3 border-gray-300">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {userData?.name?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
              </div>

              {/* Status Indicator (Ab ye perfectly bahar dikhega) */}
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 border-[3px] border-white rounded-full ${userData.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
              ></span>
            </div>

            <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
            <p className="text-gray-500 font-medium mb-4">{userData.jobRole}</p>

            <p className="text-sm text-gray-600 mb-8 italic">"{userData.bio}"</p>

            <div className="w-full h-px bg-gray-100 mb-8"></div>

            {/* 🔥 Enhanced Stats with Progress Bar */}
            <div className="w-full text-left">
              <h4 className="font-semibold text-gray-900 mb-4">
                Active Tasks ({userData.activeTasks})
              </h4>

              {/* Custom Progress Bar */}
              <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden mb-2">
                <div
                  style={{
                    width: `${(userData.todoTasks / userData.activeTasks) * 100}%`,
                  }}
                  className="bg-gray-300"
                ></div>
                <div
                  style={{
                    width: `${(userData.inProgressTasks / userData.activeTasks) * 100}%`,
                  }}
                  className="bg-blue-500"
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-6 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                  To-Do: {userData.todoTasks}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>{" "}
                  In-Progress: {userData.inProgressTasks}
                </span>
              </div>

              {/* Done Stat */}
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-green-600 leading-none mb-1">
                  {userData.completedTasks}
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Completed Tasks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (Cards)
        ========================================================================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Card 1: Professional Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Professional Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Join Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(userData.createdAt)}{" "}
                  <span className="text-gray-400 text-sm font-normal">
                    (Joined {calculateTenure(userData.createdAt)} ago)
                  </span>
                </p>
              </div>

              {/* Derived Badges Logic */}
              <div className="md:col-span-2 mt-2">
                <p className="text-sm text-gray-500 mb-3">Active Projects</p>
                <div className="flex flex-wrap gap-2.5">
                  {userData.projects?.map((proj) => (
                    <span
                      key={proj._id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${proj.isLead ? "bg-blue-50 border-blue-100 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-700"}`}
                    >
                      📁 {proj.title}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ml-1 ${proj.isLead ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        {proj.isLead ? "👑 Lead" : "Contributor"}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Information */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <UserIcon size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Mail className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">Email Address</p>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-gray-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {userData.phoneNo || "Not Added"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Account Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Account Status
              </h3>
              <p className="text-sm text-gray-500">
                Current standing and security state of your account.
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${userData.isBlocked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
            >
              {userData.isBlocked ? <X size={18} /> : <ShieldCheck size={18} />}
              {userData.isBlocked ? "Restricted" : "Active & Secure"}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EDIT PROFILE MODAL
      ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 pt-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === "general" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
              >
                General Info
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === "security" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
              >
                Security
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleUpdateProfile} className="p-6">
              {/* Tab 1: General Info */}
              {activeTab === "general" && (
                <div className="space-y-5">
                  {/* Avatar Upload UI */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="relative w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <UserIcon size={30} />
                      <button
                        type="button"
                        className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600"
                      >
                        <Camera size={14} />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Profile Picture
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, GIF or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Tab 2: Security */}
              {activeTab === "security" && (
                <div className="space-y-5">
                  <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm mb-4 flex gap-3">
                    <Lock className="shrink-0 mt-0.5" size={18} />
                    <p>
                      Changing your password will log you out of all other
                      active sessions.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile;
