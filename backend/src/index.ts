// import { Request, Response } from "express";
import { Socket } from "socket.io";
import Database from "./config/database";

import express from "express";

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});

const db = new Database();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Access-Control-Allow-Headers, Origin, Accept-Encoding, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Auth-Token, ProjectId, Accept-Language, Cache-Control, Connection, Host, Pragma, Referer');
    next();
});

io.on("connection", function (socket: Socket) {

    console.log("A user with ID: " + socket.id + " connected");

    socket.on("disconnect", function () {
        console.log("A user with ID: " + socket.id + " disconnected");
    });

    // More Socket listening here.
    if (io.sockets.connected) socket.emit("connections", Object.keys(io.sockets.connected).length);
    else socket.emit("connections", 0);

    socket.on("chat-message", async (message) => {
        const data = {
            message: message.message,
            user_id: socket.id,
            name: message.user,
        };
        await db.storeUserMessage(data);
        socket.broadcast.emit("chat-message", message);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });

    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping");
    });

    socket.on("joined", async (name) => {
        let messageData = null;
        const data = {
            name,
            user_id: socket.id,
        };
        const user = await db.addUser(data);
        if (user) {
            messageData = await db.fetchUserMessages(data);
        }
        socket.broadcast.emit("joined", messageData);
    });

    socket.on("leave", (data) => {
        socket.broadcast.emit("leave", data);
    });
});

http.listen(80, () => {
    console.log("Listening on port *:80");
});