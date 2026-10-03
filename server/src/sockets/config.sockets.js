import { Server } from "socket.io";
import { verifySocketToken } from "../middlewares/verifySocketToken.js";
import { chatHandler } from "./chatHandler.sockets.js";

 export const onlineUsers = new Map();

const socketConfig = (server) =>{
    const io = new Server(server,{
        cors:{ 
            origin: process.env.CORS_ORIGIN,
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

        console.log(`Naya authenticated socket user connect hua: ${userId} || ${role}`);

        // Modules attach karna
        chatHandler(io, socket);

        

        socket.on('disconnect', () => {
            console.log(`User disconnected : ${userId}`);
            onlineUsers.delete(String(userId));
        });
    })
}

export default socketConfig;