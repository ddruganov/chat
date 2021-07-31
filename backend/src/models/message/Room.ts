import ActiveRecord from "../../components/db/ActiveRecord";
import User from "../user/User";

export default class Room extends ActiveRecord {

    private _id: number;
    private _name: string;
    private _creator_id: number;
    private _creation_date: string;

    public static tableName() {
        return 'message.room';
    }

    public static columns() {
        return ['id', 'name', 'creator_id', 'creation_date'];
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public get creatorId() {
        return this._creator_id;
    }

    public get creator() {
        return new Promise(async (resolve) => {
            const user = await User.findOne<User>({ left: 'id', value: '=', right: this.creatorId });
            resolve(user);
        });
    }

    public get creationDate() {
        return this._creation_date;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set creatorId(value: number) {
        this._creator_id = value;
    }

    public set creationDate(value: string) {
        this._creation_date = value;
    }
}