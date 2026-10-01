import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Search, Plus, MoreVertical, Edit2, Trash2, Ban, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createUser, getUsers } from "../../services/organisation.services.js"
import { useDispatch, useSelector } from "react-redux";
import { storeUsers, addUsers } from "../../store/features/orgSlice.js";
import { formatDistanceToNow } from 'date-fns'
import { toast } from "react-toastify";

const UserManagement = ()=> {
  const [showActions, setShowActions] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "member"});
  const actionsRef = useRef(null)
  const { users } = useSelector(state=>state.organisation);
  const dispatch = useDispatch();

  useEffect(()=>{
    fetchUser();
  },[])

  useEffect(() => {
    const handler = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setShowActions(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchUser = async ()=>{
    try {
      const users = await getUsers();
      dispatch(storeUsers(users?.data));

    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }

  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br  from-blue-300 via-blue-600 to-purple-700 rounded-full flex items-center justify-center overflow-hidden">
            {
              row?.avatar ? <img src={row?.avatar} alt="Profile Image" /> :
              <span className="text-white text-sm font-medium">{value.substring(0, 2).toUpperCase()}</span>
            }
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: (value) => (
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          value === "admin" ? "bg-purple-100 text-purple-700" :
          value === "manager" ? "bg-blue-100 text-blue-700" :
          "bg-gray-100 text-gray-700"
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => (
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          value === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: "Last Active",
      accessor: "lastActive",
      cell: (value) =>(
        <p className="px-3 py-1 rounded-lg text-xs font-medium">
        {value? formatDistanceToNow(new Date(value), { addSuffix: true }):"New User"}
        </p>
      )
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (value) => (
        <div className="relative" ref={showActions === value ? actionsRef : undefined}>
          <button
            onClick={() => setShowActions(showActions === value ? null : value)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {showActions === value && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit User
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                {users.find((u) => u.id === value)?.status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete User
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const activeCount = users.filter((u) => u.status === "Active").length;

  //It's for filtering the dataset and when search,filterstatus change it will automatically update filtered value
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchStatus = statusFilter === "All Status" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const addUser = async() => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    try {
        console.log({name:newUser.name,email:newUser.email,role:newUser.role})
        const res = await createUser({name:newUser.name,email:newUser.email,role:newUser.role});

        console.log(res?.data)
        dispatch(addUsers(res.data))

        toast.success("Created!")
        setNewUser({ name: "", email: "", role: "member" });
        setShowAddModal(false);
          
        } catch (error) {
          console.log(error?.response?.data?.message);
          toast.error(error?.response?.data?.message)
        }
  
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">{users.length} users · {activeCount} active</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <Card>
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option>All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Project Manager</option>
              <option value="member">Team Member</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            {(search || roleFilter !== "All Roles" || statusFilter !== "All Status") && (
              <button
                onClick={() => { setSearch(""); setRoleFilter("All Roles"); setStatusFilter("All Status"); }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
            {filtered.length !== users.length && (
              <p className="text-xs text-gray-500 mt-2">Showing {filtered.length} of {users.length} users</p>
            )}
        </div>
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-medium">No users match your search</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <input
                  autoFocus
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                <input
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="jane@company.com"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="member">Team Member</option>
                  <option value="manager">Project Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                disabled={!newUser.name.trim() || !newUser.email.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;