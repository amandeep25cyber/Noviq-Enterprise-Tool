import { Server } from "socket.io";
import { verifySocketToken } from "../middlewares/verifySocketToken.js";
import { chatHandler } from "./chatHandler.sockets.js";
import { handleUserStatus } from "./handleUserStatus.js";

 export const onlineUsers = new Map();

const socketConfig = (server) =>{
    // Parse CORS origins — support comma-separated list in env var
    const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
        : ["http://localhost:5173", "http://localhost:5174"];

    const io = new Server(server,{
        cors:{ 
            origin: allowedOrigins,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    //Verify user middleware
    io.use(verifySocketToken);

    io.on("connection",(socket)=>{

        const { userId, role, orgId } = socket.user;

        onlineUsers.set(String(userId), {
            socketId: socket.id,
            role: role,
            orgId: String(orgId)
        });

        console.log(`Socket connected: userId=${userId} | role=${role} | socketId=${socket.id}`);

        // Status handler of the user
        handleUserStatus(io,socket);

        // Modules attach karna
        chatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: userId=${userId} | socketId=${socket.id}`);
        });
    })
}

export default socketConfig;