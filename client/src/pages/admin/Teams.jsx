import { Search, X} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import TeamMemberCard from "../../components/ui/TeamMemberCard";
import { getTeamsData, updateJobRoleOfUser } from "../../services/organisation.services";


const Teams = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(()=>{
    getTeamMembersData();
  },[]);

  const getTeamMembersData = async() =>{
    try {
      const result = await getTeamsData();
      setMembers(result?.data);

    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }

  const updateJobRole = async(jobRole,id,setShowModal,setJobRole) =>{
    try {
      await updateJobRoleOfUser(id,jobRole);
      setMembers((prevMembers) => 
        prevMembers.map((member) =>
          member._id === id ? { ...member, jobRole: jobRole } : member
      ));
      setShowModal(false);
      toast.success("Role updated!")
      setJobRole("Trainee");

    } catch (error) {
      toast.error(error.response?.data?.message)
      console.log(error.response?.data?.message)
    }
  }


  const uniqueRoles = ["All", ...Array.from(new Set(members.map((m) => m.jobRole)))];

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch = !search || m.name.toLowerCase().includes(q) || m.jobRole?.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "All" || m.jobRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1><p className="text-gray-600">{members.length} members · {members.filter((m) => m.status === "online").length} online now</p></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-56" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {uniqueRoles.slice(0, 5).map((r,idx) => (
            <button key={idx} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${roleFilter === r ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((member,idx) => (
          <TeamMemberCard member={member} updateJobRole={updateJobRole} key={member._id || idx}/>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No members match your filters</p>
        </div>
      )}
    </div>
  );
}

export default Teams;