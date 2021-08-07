import { Socket } from "socket.io";
import Transaction from "../../../components/db/query/Transaction";
import Room from "../../../models/chat/Room";
import SocketService from "../../socket.service";

export default async function Delete(socket: Socket, data: { id: number }) {
    const room = await Room.findOne<Room>({ left: 'id', value: '=', right: data.id });
    if (!room) {
        return;
    }

    const transaction = await new Transaction().begin();
    try {
        if (!(await room.delete())) {
            throw new Error('Couldnt delete room #' + room.id);
        }

        SocketService.instance.io.emit(`room.${room.id}.deleted`);
    }
    catch (e) {
        await transaction.rollback();
    }
}