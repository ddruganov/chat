import ActiveRecord from "../../components/db/ActiveRecord";

export default class AccessToken extends ActiveRecord {

    private _id: number;
    private _value: string;
    private _is_blacklisted: boolean;

    public static tableName() {
        return 'token.access_token';
    }

    public static get columns() {
        return ['id', 'value', 'is_blacklisted'];
    }

    public get id() {
        return this._id;
    }

    public get value() {
        return this._value;
    }

    public get isBlacklisted() {
        return this._is_blacklisted;
    }

    public set value(value: string) {
        this._value = value;
    }

    public set isBlacklisted(value: boolean) {
        this._is_blacklisted = value;
    }

    public async blacklist() {
        this.isBlacklisted = true;
        return await this.save();
    }
}