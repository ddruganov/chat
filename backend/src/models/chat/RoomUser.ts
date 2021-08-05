import ActiveRecord from "../../components/db/ActiveRecord";
import User from "../user/User";
import Room from "./Room";

export default class RoomUser extends ActiveRecord {

    private _id: number;
    private _room_id: number;
    private _user_id: number;
    private _join_date: string;

    public static tableName() {
        return 'chat.room_user';
    }

    public static get columns() {
        return ['id', 'room_id', 'user_id', 'join_date'];
    }

    public get id() {
        return this._id;
    }

    public get roomId() {
        return this._room_id;
    }

    public get room() {
        return new Promise(async (resolve) => {
            const room = await Room.findOne<Room>({ left: 'id', value: '=', right: this.roomId });
            resolve(room);
        });
    }

    public get userId() {
        return this._user_id;
    }

    public get user() {
        return new Promise(async (resolve) => {
            const user = await User.findOne<User>({ left: 'id', value: '=', right: this.userId });
            resolve(user);
        });
    }

    public get joinDate() {
        return this._join_date;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set roomId(value: number) {
        this._room_id = value;
    }

    public set userId(value: number) {
        this._user_id = value;
    }

    public set joinDate(value: string) {
        this._join_date = value;
    }
}