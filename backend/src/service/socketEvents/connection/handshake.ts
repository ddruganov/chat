import { Socket } from "socket.io";
import User from "../../../models/user/User";

export default async function Handshake(socket: Socket, data: any) {
    const user = await User.findOne<User>({ left: 'id', value: '=', right: data.userId });
    if (!user) {
        socket.disconnect(true);
        return;
    }

    user.lastSeen = null;
    await user.save();
}