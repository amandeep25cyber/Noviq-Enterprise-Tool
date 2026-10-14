import { Card } from "../../components/ui/Card";
import { Search, Send, Paperclip, Smile, MoreVertical, Hash, Phone, Video } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { getTeamMembers } from "../../services/shared.services.js";

const initialRooms = [
  { id: 1, name: "general", unread: 0 },
  { id: 2, name: "development", unread: 3 },
  { id: 3, name: "design", unread: 0 },
  { id: 4, name: "project-updates", unread: 5 },
  { id: 5, name: "random", unread: 0 },
];


const seedMessages = {
  1: [
    { id: 1, user: "Emily Davis", avatar: "ED", text: "Hey team! I finished the homepage design. Can someone review it?", time: "10:30 AM", isOwn: false },
    { id: 2, user: "John Smith", avatar: "JS", text: "Sure! I'll take a look in a few minutes.", time: "10:32 AM", isOwn: false },
    { id: 3, user: "You", avatar: "ME", text: "Great work Emily! The design looks amazing.", time: "10:35 AM", isOwn: true },
    { id: 4, user: "Lisa Wong", avatar: "LW", text: "I agree! Should we start implementing it today?", time: "10:37 AM", isOwn: false },
  ],
  2: [
    { id: 1, user: "John Smith", avatar: "JS", text: "PR #42 is ready for review — user auth flow.", time: "9:00 AM", isOwn: false },
    { id: 2, user: "Lisa Wong", avatar: "LW", text: "Reviewing now, looks clean so far!", time: "9:15 AM", isOwn: false },
    { id: 3, user: "You", avatar: "ME", text: "I left some comments on the token refresh logic.", time: "9:22 AM", isOwn: true },
  ],
  3: [
    { id: 1, user: "Emily Davis", avatar: "ED", text: "Updated the color tokens in Figma — please sync before you push.", time: "Yesterday", isOwn: false },
  ],
  4: [
    { id: 1, user: "Lisa Wong", avatar: "LW", text: "Sprint 3 kicks off Monday. Tasks are assigned in the board.", time: "Friday", isOwn: false },
    { id: 2, user: "You", avatar: "ME", text: "Got it, will start on the API endpoints first.", time: "Friday", isOwn: true },
  ],
  5: [
    { id: 1, user: "David Miller", avatar: "DM", text: "Who wants coffee? ☕", time: "8:00 AM", isOwn: false },
    { id: 2, user: "John Smith", avatar: "JS", text: "Always 🙋", time: "8:01 AM", isOwn: false },
  ],
};

const statusColor = {
  Active: "bg-emerald-500",
  Inactive: "bg-gray-400",
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Chat = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [messages, setMessages] = useState(seedMessages);
  const [draft, setDraft] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const bottomRef = useRef(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    getTeamMembersData();
  }, []);

  const getTeamMembersData = async () => {
    try {
      const res = await getTeamMembers();
      setTeamMembers(res?.data);
      console.log(res?.data);

    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message)
    }
  }

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const currentMessages = messages[selectedRoomId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, selectedRoomId]);

  if (!selectedRoom) return null;

  const selectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, unread: 0 } : r));
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now(),
      user: "You",
      avatar: "ME",
      text,
      time: now(),
      isOwn: true,
    };
    setMessages((prev) => ({ ...prev, [selectedRoomId]: [...(prev[selectedRoomId] ?? []), newMsg] }));
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filteredRooms = rooms.filter((r) => r.name.includes(sidebarSearch.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Chat</h1>
        <p className="text-gray-600">Communicate with your team in real-time</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-240px)] min-h-125">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                type="text"
                placeholder="Search channels..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Channels</p>
              <div className="space-y-0.5">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => selectRoom(room.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedRoomId === room.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium">#</span>
                      <span className="text-sm">{room.name}</span>
                    </div>
                    {room.unread > 0 && (
                      <span className="min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {room.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Direct Messages</p>
              <div className="space-y-0.5">
                {teamMembers.map((member) => (
                  <button
                    key={member._id}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-linear-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center overflow-hidden">
                          {
                            member.avatar ?
                              <img src={member.avatar} alt="Member Logo" /> :
                              <span className="text-white font-semibold text-[9px">{member.name.slice(0, 1).toUpperCase()}</span>
                          }
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${statusColor[member.status]}`} />
                      </div>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    {member.unread > 0 && (
                      <span className="min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {member.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">#</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 leading-none">{selectedRoom.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{teamMembers.length} members</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Call">
                <Phone className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video">
                <Video className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {currentMessages.map((msg, idx) => {
              const showHeader = idx === 0 || currentMessages[idx - 1].user !== msg.user;
              return (
                <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                  {showHeader && (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${msg.isOwn ? "bg-linear-to-br from-blue-500 to-blue-600" : "bg-linear-to-br from-violet-500 to-violet-600"
                      }`}>
                      <span className="text-white text-xs font-semibold">{msg.avatar}</span>
                    </div>
                  )}
                  {!showHeader && <div className="w-9 shrink-0" />}
                  <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                    {showHeader && (
                      <div className={`flex items-baseline gap-2 mb-1 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                        <span className="font-semibold text-gray-900 text-sm">{msg.user}</span>
                        <span className="text-[11px] text-gray-400">{msg.time}</span>
                      </div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isOwn
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-900 rounded-tl-sm"
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors shrink-0" title="Attach file">
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${selectedRoom.name}`}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors shrink-0" title="Emoji">
                <Smile className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!draft.trim()}
                className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;