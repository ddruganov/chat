import { Client } from "pg";
import databaseConfig from "../../config/database.config";
import SelectClauseParser from './clauseParsers/SelectClauseParser';
import FromClauseParser from './clauseParsers/FromClauseParser';
import JoinClauseParser from './clauseParsers/JoinClauseParser';
import WhereClauseParser from './clauseParsers/WhereClauseParser';
import Clauses from "./clauses/Clauses";
import Select from "./clauses/Select";
import From from "./clauses/From";
import Join from "./clauses/Join";

export default class Query {
    private _db: Client;

    private sql: string;

    private clauses: Clauses = {
        select: [],
        from: undefined,
        join: [],
        where: []
    };
    private limit?: number;
    private offset?: number;

    public constructor() {
        this._db = new Client(databaseConfig);
        this._db.connect((err) => {
            err && console.log('pg connection error:', err.message, err.stack);
        })
    }

    public addSelect(value: Select) {
        this.clauses.select.push(value);
        return this;
    }

    public setFrom(value: From) {
        this.clauses.from = value;
        return this;
    }

    public addJoin(value: Join) {
        this.clauses.join.push(value);
        return this;
    }

    public addWhere(value: any) {
        this.clauses.where.push(value);
        return this;
    }

    public setLimit(value: number) {
        this.limit = value;
        return this;
    }

    public setOffset(value: number) {
        this.offset = value;
        return this;
    }

    public async all() {
        this.build();
        const data = await this._db.query(this.sql);
        if (!data.rowCount) {
            return undefined;
        }

        return data.rows;
    }

    public async one() {
        this.setLimit(1);
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
        let texts = [];

        let selectText = this.clauses.select.map(select => new SelectClauseParser(select).parse()).join(' ');
        texts.push(['select', selectText].join(' '));

        this.clauses.from && texts.push(['from', new FromClauseParser(this.clauses.from).parse()].join(' '));

        this.clauses.join.forEach(join => texts.push(new JoinClauseParser(join).parse()));

        let whereText = this.clauses.where.map(where => new WhereClauseParser(where).parse()).join(' ');
        texts.push(['where', whereText].join(' '));

        this.sql = texts.join(' ');
        console.log(this.sql);
    }
}