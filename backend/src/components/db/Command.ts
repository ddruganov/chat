import { QueryResult } from "pg";
import DatabaseAccessor from "./DatabaseAccessor";
import DeleteCommand from "./DeleteCommand";
import InsertCommand from "./InsertCommand";
import UpdateCommand from "./UpdateCommand";

export default class Command extends DatabaseAccessor {
    protected sql = '';

    constructor(sql = '') {
        super();
        this.sql = sql;
    }

    public async execute(): Promise<QueryResult | any[] | undefined> {
        return await this._db.query(this.sql);
    }

    public static insert() {
        return new InsertCommand();
    }

    public static update() {
        return new UpdateCommand();
    }

    public static delete() {
        return new DeleteCommand();
    }
}