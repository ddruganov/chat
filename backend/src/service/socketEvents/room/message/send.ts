import { Socket } from "socket.io";
import DateHelper from "../../../../components/helpers/DateHelper";
import Message from "../../../../models/chat/Message";
import MessageCreationConfig from "../../../../types/chat/MessageCreationConfig";
import SocketService from "../../../socket.service";

export default async function Send(socket: Socket, data: MessageCreationConfig) {
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
    SocketService.instance.io.emit(eventName, model.getAttributes());
}