import { Server, Socket } from "socket.io";
import MessageCreationConfig from "../types/chat/MessageCreationConfig";
import RoomCreationConfig from "../types/chat/RoomCreationConfig";
import App from "./app";
import Close from "./socketEvents/connection/close";

import Handshake from './socketEvents/connection/handshake';
import Create from "./socketEvents/room/create";
import Delete from "./socketEvents/room/delete";
import Send from "./socketEvents/room/message/send";

export default class SocketService {
    private static _instance: SocketService;
    public static get instance() {
        SocketService._instance ||= new SocketService();
        return SocketService._instance;
    }

    private _io: Server;
    public get io() {
        return this._io;
    }

    public constructor() {
        this._io = new Server(App.instance.httpServer, {
            cors: {
                origin: '*',
            }
        });
    }

    public init() {
        this._io.on("connection", (socket: Socket) => {
            this.bootstrapSocketEvents(socket);
        });
    }

    private bootstrapSocketEvents(socket: Socket) {

        socket.on('connection.handshake', async (data) => await Handshake(socket, data));
        socket.on("connection.close", async (data) => await Close(socket, data));

        socket.on('room.create', async (data: RoomCreationConfig) => await Create(socket, data));
        socket.on('room.delete', async (data: { id: number }) => await Delete(socket, data));

        socket.on('room.message.send', async (data: MessageCreationConfig) => await Send(socket, data));
    }
}