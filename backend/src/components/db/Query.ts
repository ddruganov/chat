import { Client } from "pg";

type Select = {
    [key: string]: string
};

type From = {
    alias?: string;
    tableName: string;
};

export default class Query {
    private _db: Client;

    constructor() {
        // this._db = new Client({
        //     host: 'localhost',
        //     port: 5432,
        //     database: 'chat',
        //     user: 'ddruganov',
        //     password: 'admin'
        // });
        // this._db.connect((err) => {
        //     err && console.log('pg connection error:', err.message, err.stack);
        // })
    }

    public select(value: Select) {

        return this;
    }

    public from(value: From) {
        return this;
    }

    public where() {
        return this;
    }

    public limit(value: number) {
        return this;
    }

    public offset(value: number) {
        return this;
    }

    public all() {

    }

    public one() {

    }

    public scalar() {

    }
}