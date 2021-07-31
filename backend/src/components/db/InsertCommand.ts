import { Client } from "pg";
import databaseConfig from "../../config/database.config";
import StringHelper from "../helpers/StringHelper";

type Columns = {
    [key: string]: string | number;
};

export default class InsertCommand {
    private _db: Client;

    private sql: string;
    private _tableName: string;
    private _columns: Columns;

    public constructor() {
        this._db = new Client(databaseConfig);
        this._db.connect((err) => {
            err && console.log('pg connection error:', err.message, err.stack);
        })
    }

    public into(tableName: string) {
        this._tableName = tableName;
        return this;
    }

    public columns(columns: Columns) {
        this._columns = columns;
        return this;
    }

    public build() {

        const columnNames = Object.keys(this._columns).join(', ');
        const columnValues = Object.values(this._columns).map(v => StringHelper.escape(v, "'")).join(', ');

        this.sql = 'insert into ' + StringHelper.escape(this._tableName) + ' (' + columnNames + ') values (' + columnValues + ') returning *;';
    }

    public async execute() {
        this.build();

        try {
            const res = await this._db.query(this.sql);
            await this._db.end();
            if (!res.rowCount) {
                throw new Error();
            }

            const rows = res.rows;
            for (const entry of rows) {
                for (const key in entry) {
                    if (entry[key] instanceof Date) {
                        entry[key] = entry[key].toISOString().split('T').map((piece: string) => piece.split('.')[0]).join(' ');
                    }
                }
            }

            return rows;
        }
        catch (e) {
            return undefined;
        }
    }
}