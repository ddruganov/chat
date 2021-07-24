import { Client } from "pg";

type Select = {
    [key: string]: string
};

type From = {
    alias: string;
    tableName: string;
};

type Join = {
    type: string;
    from: From;
    on: Where;
};

type Where = {
    [key: string]: number | string
} | number;

type Clauses = {
    select: Select[],
    from?: From,
    join: Join[],
    where: Where[]
};

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
        this._db = new Client({
            host: 'localhost',
            port: 5432,
            database: 'chat',
            user: 'ddruganov',
            password: 'admin'
        });
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

    public addWhere(value: Where) {
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
        let sql = 'select ';

        const selectClauses = this.clauses.select;
        selectClauses.forEach((select) => {
            for (const key in select) {
                sql += [this.escape(key), 'as', this.escape(select[key]), ',', ''].join(' ');
            }
        });
        sql = sql.slice(0, -1) + ' '; // remove the trailing comma

        const fromClause = this.clauses.from;
        sql += 'from ' + this.escape(fromClause?.tableName) + ' as ' + this.escape(fromClause?.alias);
        sql += ' ';

        const joinClauses = this.clauses.join;
        joinClauses.forEach(join => {
            sql += [join.type, 'join', this.escape(join.from.tableName), 'as', this.escape(join.from.alias), 'on', ''].join(' ');
        });

        console.log('|' + sql + '|');
        this.sql = sql;
    }

    private escape(data: any, char = '"') {
        switch (typeof data) {
            case typeof 0:
                return data;
            case typeof '':
                return (data as string).split('.').map(piece => char + piece + char).join('.')
        }

        return data;
    }
}