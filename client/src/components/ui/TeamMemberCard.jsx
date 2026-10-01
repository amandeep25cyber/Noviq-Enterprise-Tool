import { Folder, MessageSquare, Mail, TrendingUp, MoreVertical, Edit2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "Designer", "Senior Frontend Developer", "Senior Backend Developer"];

const TeamMemberCard = ({member,updateJobRole})=> {
    const [showActions, setShowActions] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [jobRole, setJobRole] = useState("Trainee");
    const actionsRef = useRef(null);

    useEffect(() => {
      const handler = (e) => {
        if (!actionsRef.current?.contains(e.target)) setShowActions(null);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

  return (
    <div className='relative'>
    <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 p-6 w-full max-w-115 relative">
      
      {/* 1. Profile Section */}
      <div className='flex justify-between items-center'>
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          {/* Gradient Avatar */}
          <div className="w-12 h-12 bg-linear-to-br  from-blue-300 via-blue-600 to-purple-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300">
            {
              member?.avatar ? <img src={member?.avatar} alt="Profile Image" /> :
              <span className="text-white text-md font-medium">{member?.name?.substring(0, 2).toUpperCase()}</span>
            }
          </div>
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{member.name}</h3>
          <p className="text-[13px] text-gray-500 font-medium">{member.jobRole || "-"}</p>
        </div>
      </div>
      <div className="relative" ref={showActions === member._id ? actionsRef : undefined}>
        <button
          onClick={() => setShowActions(showActions === member._id ? null : member._id)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        {showActions === member._id && (
          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
            <button
              onClick={()=> {setShowModal(true);setJobRole(member.jobRole || "Trainee")}}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Update Role
            </button>
                        
          </div>
        )}
      </div>
      </div>

      {/* 2. Active Projects */}
      <div className="mb-6">
        <h4 className="text-[14px] font-semibold text-gray-900 mb-2">Active Projects:</h4>
        <div className="flex flex-wrap gap-2.5">
          {member.projects.map((project,idx)=>(
            <span key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eaeaec] text-gray-800 rounded-full text-xs font-semibold shadow-sm">
            <Folder className="w-3.5 h-3.5 fill-white/20" strokeWidth={2.5} />
            {project.title}
          </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-2" />

      {/* 3. Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Active Tasks */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-[35px] font-extrabold text-[#EAB308] leading-none mb-2 tracking-tight">{member.activeTasks}</div>
          <div className="text-[13px] text-gray-800 font-medium">Active Tasks</div>
        </div>
        
        {/* Completed Tasks */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-[35px] font-extrabold text-[#0EA5E9] leading-none mb-2 tracking-tight">{member.completedLast30Days}</div>
          <div className="text-[13px] text-gray-800 font-medium">Completed (Last 30 Days)</div>
          <div className="flex items-center justify-center gap-1 text-[12px] font-bold text-green-600 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
            {`+${member.completedThisWeek} this week`}
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50/50 hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-[15px] font-semibold transition-all">
          <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
          Chat
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[15px] font-semibold transition-all">
          <Mail className="w-4 h-4" strokeWidth={2.5} />
          Email
        </button>
      </div>

      {/* Update Role */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Job Role
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Role</label>
                  <select
                    value={jobRole}
                    onChange={(e)=> setJobRole(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option>Trainee</option>
                    {ROLES.map((role,idx)=><option key={idx}>{role}</option>)}
                    
                  </select>
                </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {setShowModal(false); setJobRole("Trainee")}}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick= {()=>updateJobRole(jobRole,member._id,setShowModal,setJobRole)}
                disabled = { jobRole === member.jobRole}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default TeamMemberCard;