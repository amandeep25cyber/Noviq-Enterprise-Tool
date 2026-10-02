import { Server } from "socket.io";
import { verifySocketToken } from "../middlewares/verifySocketToken.js";

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
        console.log(`Naya authenticated socket user connect hua: ${socket?.user?.userId}`);

        // Modules attach karna
        // chatHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`User disconnect hua: ${socket?.user?.userId}`);
        });
    })
}

export default socketConfig;