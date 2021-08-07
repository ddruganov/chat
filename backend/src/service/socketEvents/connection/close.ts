import { Socket } from "socket.io";
import DateHelper from "../../../components/helpers/DateHelper";
import User from "../../../models/user/User";

export default async function Close(socket: Socket, data: any) {
    const user = await User.findOne<User>({ left: 'id', value: '=', right: data.userId });
    if (!user) {
        return;
    }

    user.lastSeen = DateHelper.now();
    await user.save();
}