import ActiveRecord from "../../components/db/ActiveRecord";

export default class Message extends ActiveRecord {

    private _id: number;
    private _creation_date: string;
    private _user_id: number;
    private _contents: string;

    public static tableName() {
        return 'message.message';
    }

    public static columns() {
        return ['id', 'creation_date', 'user_id', 'contents'];
    }

    public get id() {
        return this._id;
    }

    public get creationDate() {
        return this._creation_date;
    }

    public get userId() {
        return this._user_id;
    }

    public get contents() {
        return this._contents;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set creationDate(value: string) {
        this._creation_date = value;
    }

    public set userId(value: number) {
        this._user_id = value;
    }

    public set contents(value: string) {
        this._contents = value;
    }
}