import { onlineUsers } from "./config.sockets.js";

const chatHandler = (io, socket) => {

    socket.on("join_projects", (projectIds) => {
        if (Array.isArray(projectIds)) {
            projectIds.forEach((projectId) => {
                socket.join(`project_${projectId}`);
                console.log(
                    `User ${socket?.user?.userId} (${socket?.user?.role}) joined project room: project_${projectId}`,
                );
            });
        }
    });

    socket.on("send_direct_message", (data) => {
        const { receiverId, message, senderOrgId } = data;

        const receiverData = onlineUsers.get(receiverId);

        if (receiverData && receiverData.orgId === senderOrgId) {
            io.to(receiverData.socketId).emit("receive_direct_message", {
                senderId: socket?.user?.userId,
                message: message,
                timestamp: new Date(),
            });
        } else {
            console.log(
                `Receiver ${receiverId} offline hai.`,
            );
        }
    });

    socket.on("send_project_message", (data) => {
        const { projectId, message } = data;

        socket.to(`project_${projectId}`).emit("receive_project_message", {
            senderId: socket?.user?.userId,
            projectId: projectId,
            message: message,
            timestamp: new Date(),
        });
    });
};

export {chatHandler};
