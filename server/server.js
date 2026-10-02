import dotenv from "dotenv";
import http from "http";
import { app } from "./app.js";
import { connectDB } from "./src/db/connection.db.js";
import socketConfig from "./src/sockets/config.sockets.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

const server = http.createServer(app);

socketConfig(server);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running at port:${port}`);
  });
}).catch((error)=>{
    console.log("Server to DB connection: "+error);
})
