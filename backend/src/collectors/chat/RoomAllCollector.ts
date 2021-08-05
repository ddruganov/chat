import Query from "../../components/db/Query";
import Message from "../../models/chat/Message";
import Room from "../../models/chat/Room";
import RoomUser from "../../models/chat/RoomUser";
import User from "../../models/user/User";
import BaseCollector from "../base/BaseCollector";

type FullRoomData = {
    id: number;
    name: string;
    creatorId: number;
    creationDate: string;
    messages: Message[],
    users: User[]
}

export default class RoomAllCollector extends BaseCollector {
    private user: User;

    public async get() {
        const rooms = await new Query()
            .select({
                'r.id': 'id',
                'r.name': 'name',
                'r.creator_id': 'creatorId',
                'r.creation_date': 'creationDate'
            })
            .from({ alias: 'ru', tableName: RoomUser.tableName() })
            .join({
                type: 'inner',
                from: { alias: 'r', tableName: Room.tableName() },
                on: { left: 'r.id', value: '=', right: 'ru.room_id' }
            })
            .where({ left: 'ru.user_id', value: '=', right: this.user.id })
            .all();

        if (!rooms) {
            return [];
        }

        for (const room of rooms) {
            room.messages = await new Query()
                .select({
                    id: 'id',
                    creation_date: 'creationDate',
                    user_id: 'userId',
                    contents: 'contents'
                })
                .from({ tableName: Message.tableName() })
                .where({ left: 'room_id', value: '=', right: room.id })
                .all() || [];

            room.users = await new Query()
                .select({
                    'u.id': 'id',
                    'u.name': 'name',
                    'u.nick': 'nick'
                })
                .from({ alias: 'ru', tableName: RoomUser.tableName() })
                .join({
                    type: 'inner', from: { alias: 'u', tableName: User.tableName() }, on: {
                        left: 'u.id',
                        value: '=',
                        right: 'ru.user_id'
                    }
                })
                .where({ left: 'ru.room_id', value: '=', right: room.id })
                .all();
        }

        return rooms; //.filter((r: FullRoomData) => r.messages.length || r.creatorId === this.user.id);
    }

    public setUser(value: User) {
        this.user = value;
        return this;
    }
}