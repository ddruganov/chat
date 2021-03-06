import DateHelper from "../../helpers/DateHelper";
import FromClauseParser from "../clauseParsers/FromClauseParser";
import JoinClauseParser from "../clauseParsers/JoinClauseParser";
import SelectClauseParser from "../clauseParsers/SelectClauseParser";
import WhereClauseParser from "../clauseParsers/WhereClauseParser";
import Clauses from "../clauses/Clauses";
import From from "../clauses/From";
import Join from "../clauses/Join";
import Order from "../clauses/Order";
import Select from "../clauses/Select";
import Operator from "../clauses/where/Operator";
import Where from "../clauses/where/Where";
import DatabaseAccessor from "./DatabaseAccessor";

export default class Query extends DatabaseAccessor {
    private sql: string;

    private clauses: Clauses = {
        select: [],
        from: undefined,
        join: [],
        where: []
    };
    private _limit?: number;
    private _offset?: number;
    private order?: Order;

    public select(value: Select) {
        this.clauses.select = [value];
        return this;
    }

    public addSelect(value: Select) {
        this.clauses.select.push(value);
        return this;
    }

    public from(value: From) {
        this.clauses.from = value;
        return this;
    }

    public join(value: Join) {
        this.clauses.join.push(value);
        return this;
    }

    public where(value: Where) {
        this.clauses.where.push(value);
        return this;
    }

    public andWhere(value: Where) {
        this.addWhere('and', value);

        return this;
    }

    public orWhere(value: Where) {
        this.addWhere('or', value);

        return this;
    }

    private addWhere(operator: string, value: Where) {
        const clause: Operator = {
            operator: operator,
            operands: [
                ...this.clauses.where,
                value
            ]
        };
        this.clauses.where = [clause];

        return this;
    }

    public limit(value: number) {
        this._limit = value;
        return this;
    }

    public offset(value: number) {
        this._offset = value;
        return this;
    }

    public orderBy(value: Order) {
        this.order = value;
        return this;
    }

    public async all<T = any>(): Promise<T[] | undefined> {
        this.build();

        // console.log(this.sql);
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
            console.log('query error:', e.message);
            console.log('executed query:', this.sql);
            return undefined;
        }
    }

    public async one() {
        this.limit(1);
        const all = await this.all();
        if (!all) {
            return undefined;
        }

        return all[0];
    }

    public async scalar() {
        const row = await this.one();
        if (!row) {
            return undefined;
        }

        return row[Object.keys(row)[0]];
    }

    public build() {
        let texts: string[] = [];

        let selectText = this.clauses.select.map(select => new SelectClauseParser(select).parse()).join(', ');
        texts.push(['select', selectText].join(' '));

        this.clauses.from && texts.push(['from', new FromClauseParser(this.clauses.from).parse()].join(' '));

        this.clauses.join.forEach(join => texts.push(new JoinClauseParser(join).parse()));

        if (this.clauses.where.length) {
            let whereText = this.clauses.where.map(where => new WhereClauseParser(where).parse()).join(' ');
            texts.push(['where', whereText].join(' '));
        }

        this.order && texts.push(['order by', this.order.column, this.order.direction].join(' '));

        this._limit && texts.push(['limit', String(this._limit)].join(' '));

        this._offset && texts.push(['offset', String(this._offset)].join(' '));

        this.sql = texts.join(' ');
    }
}