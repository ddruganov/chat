import StringHelper from "../helpers/StringHelper";
import WhereClauseParser from "./clauseParsers/WhereClauseParser";
import Where from "./clauses/where/Where";
import Columns from "./Columns";
import DatabaseAccessor from "./DatabaseAccessor";

export default class UpdateCommand extends DatabaseAccessor {
    private sql: string;
    private _tableName: string;
    private _columns: Columns;
    private _where?: Where;

    public table(tableName: string) {
        this._tableName = tableName;
        return this;
    }

    public set(columns: Columns) {
        this._columns = columns;
        return this;
    }

    public where(condition: Where) {
        this._where = condition;
        return this;
    }

    public build() {
        let set = [];
        for (const key in this._columns) {
            set.push(key + ' = ' + StringHelper.escape(this._columns[key], "'"));
        }

        this.sql = 'update ' + StringHelper.escape(this._tableName) + ' set ' + set.join(', ');
        this._where && (this.sql += ' where ' + new WhereClauseParser(this._where).parse());
    }

    public async execute() {
        this.build();

        try {
            await this._db.query(this.sql);
        }
        catch (e) {
            return false;
        }

        return true;
    }
}