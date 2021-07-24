import { Client, QueryResult } from "pg";
import databaseConfig from "../../config/database.config";

type Insert = {
    fields: { [key: string]: string | number },
    tableName: string;
};

export default class Command {

    private sql: string;
    private data: (number | string)[];

    private _db: Client;

    public constructor(sql: string = '', data: (number | string)[] = []) {
        this.sql = sql;
        this.data = data;
        this._db = new Client(databaseConfig);
        this._db.connect((err) => {
            err && console.log('pg connection error:', err.message, err.stack);
        })
    }

    public insert(value: Insert) {
        return this;
    }

    public async execute(): Promise<QueryResult<any>> {
        return new Promise(async (resolve, reject) => {
            this._db.query(
                this.sql,
                this.data,
                (err, res) => {
                    err ? reject(new Error(err.message)) : resolve(res)
                });
        });
    }
}