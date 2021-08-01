import { Socket } from "socket.io";

import express from "express";
import AuthController from "./controllers/AuthController";
import cors from "cors";
import bodyParser from "body-parser";
import cookies from "cookie-parser";
import MessageController from "./controllers/MessageController";
import SettingsController from "./controllers/SettingsController";
import User from "./models/user/User";
import DateHelper from "./components/helpers/DateHelper";
import Message from "./models/message/Message";

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
    allowedHeaders: ['Origin', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Origin', 'Accept-Encoding', 'X-Requested-With', 'Content-Type', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'X-Access-Token', 'X-Refresh-Token', 'Accept-Language', 'Cache-Control', 'Connection', 'Host', 'Pragma', 'Referer'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: true,
    credentials: true
}));

app.use('/auth', AuthController);
app.use('/message', MessageController);
app.use('/settings', SettingsController);

io.on("connection", function (socket: Socket) {

    socket.on('connection.handshake', async (data) => {
        const user = await User.findOne<User>({ left: 'id', value: '=', right: data.userId });
        if (!user) {
            socket.disconnect(true);
            return;
        }

        user.lastSeen = null;
        await user.save();
    });

    socket.on("connection.close", async (data) => {
        const user = await User.findOne<User>({ left: 'id', value: '=', right: data.userId });
        if (!user) {
            return;
        }

        user.lastSeen = DateHelper.now().toUTCString();
        await user.save();
    });

    socket.on('room.message', async (data) => {
        const eventName = `room.${data.roomId}.message`;

        const model = new Message({
            creationDate: DateHelper.now().toUTCString(),
            userId: data.userId,
            roomId: data.roomId,
            contents: data.contents
        });
        const saveSuccess = await model.save();
        if (!saveSuccess) {
            return;
        }

        socket.emit(eventName, model.getAttributes());
    });
});

http.listen(3000, () => {
    console.log("Listening on port localhost:3000");
});