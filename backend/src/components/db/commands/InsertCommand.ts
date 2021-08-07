import Columns from "../../../types/db/Columns";
import DateHelper from "../../helpers/DateHelper";
import StringHelper from "../../helpers/StringHelper";
import DatabaseAccessor from "../query/DatabaseAccessor";

export default class InsertCommand extends DatabaseAccessor {
    private sql = '';

    private _tableName: string;
    private _columns: Columns;

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

        this.sql = ['insert', 'into', StringHelper.escape(this._tableName), '(', columnNames, ')', 'values', '(', columnValues, ')', 'returning', '*'].join(' ');
    }

    public async execute() {
        this.build();

        try {
            const res = await this._db.query(this.sql);
            if (!res.rowCount) {
                throw new Error();
            }

            const rows = res.rows;
            for (const entry of rows) {
                for (const key in entry) {
                    if (entry[key] instanceof Date) {
                        entry[key] = DateHelper.format(entry[key]);
                    }
                }
            }

            return rows;
        }
        catch (e) {
            console.log('insert error:', e.message);
            console.log('executed sql:', this.sql);
            return undefined;
        }
    }
}