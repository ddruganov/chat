import { Socket } from "socket.io";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookies from "cookie-parser";
import User from "./models/user/User";
import DateHelper from "./components/helpers/DateHelper";
import Message from "./models/chat/Message";
import fs from 'fs';
import Room from "./models/chat/Room";
import RoomCreationConfig from "./types/chat/RoomCreationConfig";
import Transaction from "./components/db/Transaction";
import MessageCreationConfig from "./types/chat/MessageCreationConfig";

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

const testFolder = __dirname + '/controllers';
fs.readdir(testFolder, (_, files) => {
    files.forEach(file => {
        /^.*\.controller\.ts$/.test(file) && new (require(testFolder + '/' + file)).default();
    });
});

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

        user.lastSeen = DateHelper.now();
        await user.save();
    });

    socket.on('room.create', async (data: RoomCreationConfig) => {
        const transaction = await new Transaction().begin();
        try {
            const newRoom = await Room.new(data);
            if (!newRoom) {
                throw new Error();
            }

            await transaction.commit();

            for (const userId of [data.creatorId, data.with]) {
                io.emit(`user.${userId}.invited`, newRoom.getAttributes());
            }
        }
        catch (e) {
            await transaction.rollback();
        }
    });

    socket.on('room.delete', async (data: { id: number }) => {
        const room = await Room.findOne<Room>({ left: 'id', value: '=', right: data.id });
        if (!room) {
            return;
        }

        if (!(await room.delete())) {
            return;
        }

        io.emit(`room.${room.id}.deleted`);
    })

    socket.on('room.message.send', async (data: MessageCreationConfig) => {
        const model = new Message({
            creationDate: DateHelper.now(),
            userId: data.userId,
            roomId: data.roomId,
            contents: data.contents
        });
        const saveSuccess = await model.save();
        if (!saveSuccess) {
            return;
        }

        const eventName = `room.${data.roomId}.message.receive`;
        io.emit(eventName, model.getAttributes());
    });
});

http.listen(3000, () => {
    console.log("Listening on port localhost:3000");
});

export default app;