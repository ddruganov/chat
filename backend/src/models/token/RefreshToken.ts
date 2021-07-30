import ActiveRecord from "../../components/db/ActiveRecord";

export default class RefreshToken extends ActiveRecord {

    private _id: number;
    private _user_id: number;
    private _issue_date: string;
    private _expiration_date: string;
    private _value: string;

    public static tableName() {
        return 'token.refresh_token';
    }

    public static columns() {
        return ['id', 'user_id', 'issue_date', 'expiration_date', 'value'];
    }

    public get id() {
        return this._id;
    }

    public get userId() {
        return this._user_id;
    }

    public get issueDate() {
        return this._issue_date;
    }

    public get expirationDate() {
        return this._expiration_date;
    }

    public get value() {
        return this._value;
    }

    public set userId(value: number) {
        this._user_id = value;
    }

    public set issueDate(value: string) {
        this._issue_date = value;
    }

    public set expirationDate(value: string) {
        this._expiration_date = value;
    }

    public set value(value: string) {
        this._value = value;
    }
}