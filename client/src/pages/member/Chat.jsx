import {
  Search, Send, Paperclip, Smile, MoreVertical,
  Phone, Video, Hash, Users, MessageSquare, Loader2,
} from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getProjectsGroup,
  getTeamMembers,
  sendDirectMessage,
  getDirectMessages,
  sendProjectMessage,
  getProjectMessages,
} from "../../services/shared.services.js";
import { SocketContext } from "../../context/socketContext.js";

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Chat = () => {
  const socket = useContext(SocketContext);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.userId;

  // Sidebar state ────────────────────────────
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectRooms, setProjectRooms] = useState([]);
  const [sidebarSearch, setSidebarSearch] = useState("");

  // ── Active chat ──────────────────────────────
  // chatType: "dm" | "project"
  const [chatType, setChatType] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatName, setActiveChatName] = useState("");

  const chatTypeRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const projectRoomsRef = useRef([]);

  // Keep refs in sync immediately (no useEffect needed — inline assignment)
  chatTypeRef.current = chatType;
  activeChatIdRef.current = activeChatId;
  projectRoomsRef.current = projectRooms;

  // ── Messages ─────────────────────────────────
  const [messagesMap, setMessagesMap]       = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending]               = useState(false);
  const [draft, setDraft]                   = useState("");

  const bottomRef = useRef(null);

  // ── Fetch sidebar data on mount ───────────────
  useEffect(() => {
    fetchTeamMembers();
    fetchProjectRooms();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await getTeamMembers();
      setTeamMembers((res?.data || []).map((m) => ({ ...m, unread: 0 })));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load team members");
    }
  };

  const fetchProjectRooms = async () => {
    try {
      const res = await getProjectsGroup();
      setProjectRooms((res?.data || []).map((p) => ({ ...p, unread: 0 })));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load project chats");
    }
  };

  // ── Socket setup ──────────────────────────────
  // KEY FIX: We listen for the "connect" event and emit join_projects INSIDE it.
  // This guarantees the socket is authenticated and connected before we try to
  // join rooms. We also re-join on every reconnect automatically.
  useEffect(() => {
    if (!socket) return;

    // ── join_projects helper (uses ref so always has latest rooms) ──
    const joinProjectRooms = () => {
      const rooms = projectRoomsRef.current;
      if (rooms.length === 0) return;
      const ids = rooms.map((r) => r._id);
      socket.emit("join_projects", ids);
      console.log("[Chat] Emitted join_projects for:", ids);
    };

    // ── Fire immediately if socket is already connected ──
    // (component mounted AFTER socket connected, e.g. page navigation)
    if (socket.connected) {
      joinProjectRooms();
    }

    // ── Re-join on every connect / reconnect ────
    socket.on("connect", joinProjectRooms);

    // ── Receive direct message ──────────────────
    const handleDirectMessage = (data) => {
      const { senderId, message, timestamp } = data;
      const key = `dm_${senderId}`;
      const isCurrentChat =
        chatTypeRef.current === "dm" && activeChatIdRef.current === senderId;

      setMessagesMap((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] || []),
          {
            _id: `tmp_${Date.now()}`,
            sender: senderId,
            message,
            createdAt: timestamp,
            isOwn: false,
            senderName: "",   // resolved at render time from teamMembers state
          },
        ],
      }));

      // Bubble to top + unread badge
      setTeamMembers((prev) => {
        const updated = prev.map((m) =>
          m._id === senderId
            ? {
                ...m,
                recentMessageText: message,
                lastMessageTime: timestamp,
                unread: isCurrentChat ? (m.unread || 0) : (m.unread || 0) + 1,
              }
            : m
        );
        return [...updated].sort(
          (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
      });
    };

    // ── Receive project message ─────────────────
    const handleProjectMessage = (data) => {
      const { senderId, projectId, message, timestamp } = data;
      const key = `project_${projectId}`;
      const isCurrentChat =
        chatTypeRef.current === "project" && activeChatIdRef.current === projectId;

      setMessagesMap((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] || []),
          {
            _id: `tmp_${Date.now()}`,
            sender: senderId,
            message,
            createdAt: timestamp,
            isOwn: false,
            senderName: "",   // resolved at render time
          },
        ],
      }));

      // Bubble to top + unread badge
      setProjectRooms((prev) => {
        const updated = prev.map((p) =>
          p._id === projectId
            ? {
                ...p,
                recentMessageText: message,
                lastMessageTime: timestamp,
                unread: isCurrentChat ? (p.unread || 0) : (p.unread || 0) + 1,
              }
            : p
        );
        return [...updated].sort(
          (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
      });
    };

    socket.on("receive_direct_message",  handleDirectMessage);
    socket.on("receive_project_message", handleProjectMessage);

    return () => {
      socket.off("connect",                joinProjectRooms);
      socket.off("receive_direct_message", handleDirectMessage);
      socket.off("receive_project_message",handleProjectMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !socket.connected || projectRooms.length === 0) return;
    const ids = projectRooms.map((r) => r._id);
    socket.emit("join_projects", ids);
    console.log("[Chat] join_projects after rooms loaded:", ids);
  }, [projectRooms]); // fires whenever projectRooms changes (initial load)

  // ── Auto-scroll ──────────────────────────────
  const currentKey = chatType && activeChatId
    ? `${chatType}_${activeChatId}`
    : null;
  const currentMessages = currentKey ? (messagesMap[currentKey] || []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, currentKey]);

  // ── Select DM ────────────────────────────────
  const selectDM = async (member) => {
    const key = `dm_${member._id}`;
    setChatType("dm");
    setActiveChatId(member._id);
    setActiveChatName(member.name);

    // Clear badge
    setTeamMembers((prev) =>
      prev.map((m) => (m._id === member._id ? { ...m, unread: 0 } : m))
    );

    if (!messagesMap[key]) {
      setLoadingMessages(true);
      try {
        const res = await getDirectMessages(member._id);
        const msgs = (res?.data || []).map((m) => {
          const isOwn =
            String(m.sender) === String(currentUserId) ||
            String(m.sender?._id) === String(currentUserId);
          return { ...m, isOwn, senderName: isOwn ? "You" : member.name };
        });
        setMessagesMap((prev) => ({ ...prev, [key]: msgs }));
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  // ── Select Project ───────────────────────────
  const selectProject = async (project) => {
    const key = `project_${project._id}`;
    setChatType("project");
    setActiveChatId(project._id);
    setActiveChatName(project.title);

    // Clear badge
    setProjectRooms((prev) =>
      prev.map((p) => (p._id === project._id ? { ...p, unread: 0 } : p))
    );

    if (!messagesMap[key]) {
      setLoadingMessages(true);
      try {
        const res = await getProjectMessages(project._id);
        const msgs = (res?.data || []).map((m) => {
          const isOwn =
            String(m.sender) === String(currentUserId) ||
            String(m.sender?._id) === String(currentUserId);
          return {
            ...m,
            isOwn,
            senderName: isOwn ? "You" : (m.sender?.name || "Team Member"),
          };
        });
        setMessagesMap((prev) => ({ ...prev, [key]: msgs }));
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  // ── Send message ─────────────────────────────
  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !chatType || !activeChatId || sending) return;

    setSending(true);

    const optimisticMsg = {
      _id: `opt_${Date.now()}`,
      sender: currentUserId,
      message: text,
      createdAt: new Date().toISOString(),
      isOwn: true,
      senderName: "You",
    };

    const key = currentKey;
    setMessagesMap((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), optimisticMsg],
    }));
    setDraft("");

    // Bubble sender's chat to top
    const nowISO = new Date().toISOString();
    if (chatType === "dm") {
      setTeamMembers((prev) => {
        const updated = prev.map((m) =>
          m._id === activeChatId
            ? { ...m, recentMessageText: text, lastMessageTime: nowISO }
            : m
        );
        return [...updated].sort(
          (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
      });
    } else {
      setProjectRooms((prev) => {
        const updated = prev.map((p) =>
          p._id === activeChatId
            ? { ...p, recentMessageText: text, lastMessageTime: nowISO }
            : p
        );
        return [...updated].sort(
          (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
      });
    }

    try {
      if (chatType === "dm") {
        await sendDirectMessage(text, activeChatId);
        if (socket?.connected) {
          socket.emit("send_direct_message", {
            receiverId: String(activeChatId),
            message: text,
          });
        }
      } else {
        await sendProjectMessage(text, activeChatId);
        if (socket?.connected) {
          socket.emit("send_project_message", {
            projectId: String(activeChatId),
            message: text,
          });
        }
      }
    } catch (err) {
      // Rollback optimistic message
      setMessagesMap((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((m) => m._id !== optimisticMsg._id),
      }));
      setDraft(text);
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Sidebar filtering ────────────────────────
  const filteredMembers  = teamMembers.filter((m) =>
    m.name?.toLowerCase().includes(sidebarSearch.toLowerCase())
  );
  const filteredProjects = projectRooms.filter((p) =>
    p.title?.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  // ── Status dot colour ────────────────────────
  const statusDot = (s) =>
    s === "Active" || s === "online" || s === true ? "bg-emerald-500" : "bg-gray-400";

  // ── Resolve display name for socket-delivered messages ──
  // (senderName is empty string for socket messages; look up from teamMembers)
  const resolveName = (msg) => {
    if (msg.senderName) return msg.senderName;
    const found = teamMembers.find(
      (m) =>
        String(m._id) === String(msg.sender) ||
        String(m._id) === String(msg.sender?._id)
    );
    return found?.name || "Team Member";
  };

  // ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Chat</h1>
        <p className="text-gray-600">Communicate with your team in real-time</p>
        {/* Dev indicator — socket status */}
        {socket && (
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${socket.connected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${socket.connected ? "bg-emerald-500" : "bg-amber-400"}`} />
            {socket.connected ? "Real-time connected" : "Connecting…"}
          </span>
        )}
      </div>

      <div className="flex gap-6 h-[calc(100vh-240px)] min-h-125">

        {/* ══ Sidebar ═══════════════════════════════ */}
        <div className="w-64 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-5">

            {/* Project Chats */}
            {filteredProjects.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Project Chats
                </p>
                <div className="space-y-0.5">
                  {filteredProjects.map((project) => {
                    const isActive = chatType === "project" && activeChatId === project._id;
                    return (
                      <button
                        key={project._id}
                        onClick={() => selectProject(project)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                          isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Hash className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <div className="min-w-0">
                            <p className="text-sm truncate">{project.title}</p>
                            {project.recentMessageText && (
                              <p className="text-[10px] text-gray-400 truncate">{project.recentMessageText}</p>
                            )}
                          </div>
                        </div>
                        {project.unread > 0 && (
                          <span className="ml-2 min-w-5 h-5 px-1.5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shrink-0">
                            {project.unread > 99 ? "99+" : project.unread}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direct Messages */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Direct Messages
              </p>
              <div className="space-y-0.5">
                {filteredMembers.length === 0 && (
                  <p className="text-xs text-gray-400 px-2 py-1">No members found</p>
                )}
                {filteredMembers.map((member) => {
                  const isActive = chatType === "dm" && activeChatId === member._id;
                  return (
                    <button
                      key={member._id}
                      onClick={() => selectDM(member)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                        isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-7 h-7 bg-linear-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center overflow-hidden">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-semibold text-[9px]">{getInitials(member.name)}</span>
                          )}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${statusDot(member.status || member.isOnline)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{member.name}</p>
                        {member.recentMessageText && (
                          <p className="text-[10px] text-gray-400 truncate">{member.recentMessageText}</p>
                        )}
                      </div>
                      {member.unread > 0 && (
                        <span className="min-w-5 h-5 px-1.5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shrink-0">
                          {member.unread > 99 ? "99+" : member.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ══ Main Chat Area ═════════════════════════ */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {!chatType ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Start a Conversation</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Select a team member for a direct message or choose a project chat from the sidebar.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatType === "project" ? "bg-blue-100" : "bg-violet-100"}`}>
                    {chatType === "project"
                      ? <Hash className="w-4 h-4 text-blue-600" />
                      : <Users className="w-4 h-4 text-violet-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-none">{activeChatName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {chatType === "project" ? "Project group chat" : "Direct message"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Phone className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Video className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-gray-500" /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">No messages yet. Be the first to say something! 👋</p>
                  </div>
                ) : (
                  currentMessages.map((msg, idx) => {
                    const isOwn = msg.isOwn;
                    const showHeader =
                      idx === 0 ||
                      String(currentMessages[idx - 1].sender) !== String(msg.sender) ||
                      currentMessages[idx - 1].isOwn !== msg.isOwn;

                    const displayName = isOwn ? (user?.name || "You") : resolveName(msg);
                    const initials = getInitials(displayName);

                    return (
                      <div key={msg._id || idx} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                        {showHeader ? (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isOwn ? "bg-linear-to-br from-blue-500 to-blue-600" : "bg-linear-to-br from-violet-500 to-violet-600"}`}>
                            <span className="text-white text-xs font-semibold">{initials}</span>
                          </div>
                        ) : (
                          <div className="w-9 shrink-0" />
                        )}
                        <div className={`max-w-xs lg:max-w-md flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                          {showHeader && (
                            <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                              <span className="font-semibold text-gray-900 text-sm">{isOwn ? "You" : displayName}</span>
                              <span className="text-[11px] text-gray-400">{formatTime(msg.createdAt)}</span>
                            </div>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-900 rounded-tl-sm"}`}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors shrink-0"><Paperclip className="w-4 h-4 text-gray-500" /></button>
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={chatType === "project" ? `Message #${activeChatName}` : `Message ${activeChatName}`}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    disabled={sending}
                  />
                  <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors shrink-0"><Smile className="w-4 h-4 text-gray-500" /></button>
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim() || sending}
                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;