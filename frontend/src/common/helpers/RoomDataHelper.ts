import User from "@/types/auth/User";
import Room from "@/types/chat/Room";
import StringHelper from "./StringHelper";

export default class RoomDataHelper {
    public static getName(room: Room, authenticatedUser: User | undefined = undefined) {
        if (!authenticatedUser || room.users.length > 2) {
            return room.name;
        }

        return room.users.filter((u) => u.id !== authenticatedUser.id)[0].name;
    }

    public static getUserCount(room: Room) {
        return StringHelper.getWordCount(room.users.length, { "1": 'пользователь', "2-3-4": 'пользователя', 'else': 'пользователей' });
    }
}