import Columns from "../../../types/db/Columns";
import StringHelper from "../../helpers/StringHelper";
import WhereClauseParser from "../clauseParsers/WhereClauseParser";
import Where from "../clauses/where/Where";
import DatabaseAccessor from "../query/DatabaseAccessor";

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
            set.push([key, '=', StringHelper.escape(this._columns[key], "'")].join(' '));
        }

        this.sql = ['update', StringHelper.escape(this._tableName), 'set', set.join(', ')].join(' ');

        if (!this._where) {
            return;
        }

        this.sql += ['', 'where', new WhereClauseParser(this._where).parse()].join(' ');
    }

    public async execute() {
        this.build();

        try {
            await this._db.query(this.sql);
        }
        catch (e) {
            console.log('update error:', e.message);
            console.log('executed sql:', this.sql);
            return false;
        }

        return true;
    }
}