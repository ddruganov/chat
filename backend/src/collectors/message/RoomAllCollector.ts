import Query from "../../components/db/Query";
import Room from "../../models/message/Room";
import RoomUser from "../../models/message/RoomUser";
import User from "../../models/user/User";
import BaseCollector from "../base/BaseCollector";

export default class RoomAllCollector extends BaseCollector {
    private user: User;

    public async get() {
        return await new Query()
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
    }

    public setUser(value: User) {
        this.user = value;
        return this;
    }
}