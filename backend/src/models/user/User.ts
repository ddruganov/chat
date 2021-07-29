import Where from "../../components/db/clauses/where/Where";
import Query from "../../components/db/Query";

type UserData = {
    id: number;
    email: string;
    password: string;
    name: string;
    signupDate: string;
};

export default class User {

    private _id: number;
    private _email: string;
    private _password: string;
    private _name: string;
    private _signup_date: string;

    public static tableName() {
        return 'user.user';
    }

    public static get columns() {
        return ['id', 'email', 'password', 'name', 'signup_date'];
    }

    public static async findAll(condition: Where): Promise<User[] | undefined> {
        let select = {} as { [key: string]: string };
        this.columns.forEach(column => {
            select[column] = '_' + column;
        });

        const data = await new Query()
            .select(select)
            .from({ alias: 'u', tableName: User.tableName() })
            .where(condition)
            .all();

        if (!data) {
            return undefined;
        }

        return data.map(userData => Object.assign(new User(), userData));
    }

    public static async findOne(condition: Where): Promise<User | undefined> {
        let select = {} as { [key: string]: string };
        this.columns.forEach(column => {
            select[column] = '_' + column;
        });

        const data = await new Query()
            .select(select)
            .from({ alias: 'u', tableName: User.tableName() })
            .where(condition)
            .one();

        if (!data) {
            return undefined;
        }

        return Object.assign(new User(), data);
    }

    public get id() {
        return this._id;
    }

    public get signupDate() {
        return this._signup_date;
    }
}