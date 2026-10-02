import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { SocketContext } from "./socketContext";
import { useSelector } from "react-redux"

const SocketProvider = ({children}) =>{
    const [socket,setSocket] = useState(null);

    const { isLoggedIn } = useSelector(state=>state.auth)

    useEffect(() => {
        
        if (!isLoggedIn) {
           
            if (socket) {
                setSocket(null);
            }
            return;
        }

        const URI = import.meta.env.VITE_SOCKET_URI;

        const socketInstance = io(URI, { withCredentials: true });

        socketInstance.on("connect", () => {
            console.log("Connected with Socket ID:", socketInstance.id);
        });

        socketInstance.on("connect_error", (err) => {
            console.error("Socket Connection Error:", err.message);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [isLoggedIn]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;