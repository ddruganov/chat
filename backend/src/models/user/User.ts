import ActiveRecord from "../../components/db/ActiveRecord";

export default class User extends ActiveRecord {

    private _id: number;
    private _email: string;
    private _password: string;
    private _name: string;
    private _signup_date: string;
    private _last_seen: string | null;

    public static tableName() {
        return 'user.user';
    }

    public static columns() {
        return ['id', 'email', 'password', 'name', 'signup_date', 'last_seen'];
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public get signupDate() {
        return this._signup_date;
    }

    public get lastSeen() {
        return this._last_seen;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set email(value: string) {
        this._email = value;
    }

    public set password(value: string) {
        this._password = value;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set signupDate(value: string) {
        this._signup_date = value;
    }

    public set lastSeen(value: string | null) {
        this._last_seen = value;
    }
}