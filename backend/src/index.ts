// import { Socket } from "socket.io";
// import Command from "./components/db/Command";

import express from "express";
import AuthController from "./controllers/AuthController";
import cors from "cors";
import bodyParser from "body-parser";
import cookies from "cookie-parser";

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});

app.use(bodyParser.json())
app.use(cookies())

app.use(cors({
    allowedHeaders: ['Origin', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Origin', 'Accept-Encoding', 'X-Requested-With', 'Content-Type', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'X-Access-Token', 'Accept-Language', 'Cache-Control', 'Connection', 'Host', 'Pragma', 'Referer'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: true,
    credentials: true
}));

app.use('/auth', AuthController);

// io.on("connection", function (socket: Socket) {

//     console.log("A user with ID: " + socket.id + " connected");

//     socket.on("disconnect", function () {
//         console.log("A user with ID: " + socket.id + " disconnected");
//     });

//     // More Socket listening here.
//     if (io.sockets.connected) socket.emit("connections", Object.keys(io.sockets.connected).length);
//     else socket.emit("connections", 0);

//     socket.on("chat-message", async (message) => {
//         await new Command("INSERT INTO messages (message, user_id, name) VALUES ($1, $2, $3)", [message.message, socket.id, message.user]).execute();
//         socket.broadcast.emit("chat-message", message);
//     });

//     socket.on("typing", (data) => {
//         socket.broadcast.emit("typing", data);
//     });

//     socket.on("stopTyping", () => {
//         socket.broadcast.emit("stopTyping");
//     });

//     socket.on("joined", async (name) => {
//         let messageData = null;
//         const res = await new Command("insert into users (name, user_id) values ($1, $2)", [name, socket.id]).execute();
//         if (res.rowCount) {
//             messageData = await new Command("select * from messages where name = $1", [name]).execute();
//         }
//         socket.broadcast.emit("joined", messageData?.rows);
//     });

//     socket.on("leave", (data) => {
//         socket.broadcast.emit("leave", data);
//     });
// });

http.listen(3000, () => {
    console.log("Listening on port localhost:3000");
});