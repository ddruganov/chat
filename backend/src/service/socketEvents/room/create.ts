import { Socket } from "socket.io";
import Transaction from "../../../components/db/query/Transaction";
import Room from "../../../models/chat/Room";
import RoomCreationConfig from "../../../types/chat/RoomCreationConfig";
import SocketService from "../../socket.service";

export default async function Create(socket: Socket, data: RoomCreationConfig) {
    const transaction = await new Transaction().begin();
    try {
        const newRoom = await Room.new(data);
        if (!newRoom) {
            throw new Error();
        }

        await transaction.commit();

        for (const userId of [data.creatorId, data.with]) {
            SocketService.instance.io.emit(`user.${userId}.invited`, newRoom.getAttributes());
        }
    }
    catch (e) {
        await transaction.rollback();
    }
}