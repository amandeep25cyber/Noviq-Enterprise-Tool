import { User } from '../models/user.models.js'; 

const userConnections = new Map();
const disconnectTimeouts = new Map();

const handleUserStatus = async (io, socket) => {

  const userId = socket.user.userId; 
  const orgId = socket.user.orgId;

  try {
    socket.join(orgId);

    const currentCount = userConnections.get(String(userId)) || 0;
    userConnections.set(String(userId), currentCount + 1);

    if (disconnectTimeouts.has(String(userId))) {
      clearTimeout(disconnectTimeouts.get(String(userId)));
      disconnectTimeouts.delete(String(userId));
    } 
    else if (currentCount === 0) {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      
      socket.to(orgId).emit("user_status_changed", { userId, status: "online" });
    }

    socket.on("disconnect", () => {
      const count = userConnections.get(String(userId)) || 0;
      const newCount = count > 0 ? count - 1 : 0;
      userConnections.set(String(userId), newCount);

      if (newCount === 0) {

        const timeoutId = setTimeout(async () => {
          try {
            await User.findByIdAndUpdate(userId, { isOnline: false });
            
            socket.to(orgId).emit("user_status_changed", { userId, status: "offline" });
            
            userConnections.delete(String(userId));
            disconnectTimeouts.delete(String(userId));
          } catch (err) {
            console.error("DB update fails on disconnect event:", err);
          }
        }, 5000); 

        disconnectTimeouts.set(String(userId), timeoutId);
      }
    });

  } catch (error) {
    console.error("Status update error:", error);
  }
};

export { handleUserStatus };