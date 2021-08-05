import Select from "./clauses/Select";
import Where from "./clauses/where/Where";
import Query from "./Query";
import Command from "./Command";
import StringHelper from "../helpers/StringHelper";
import Columns from "./Columns";

export default class ActiveRecord {

    public static get SORT_ASC() {
        return 'asc';
    }

    public static get SORT_DESC() {
        return 'desc';
    }

    [key: string]: any;

    private _isNew: boolean = true;
    public get isNew() {
        return this._isNew;
    }

    public constructor(config: { [key: string]: any } = {}) {
        Object.assign(this, config);
    }

    public get static() {
        return this.constructor as typeof ActiveRecord;
    }

    public static tableName(): string {
        throw new Error('Not implemented!');
    }

    public static get columns(): string[] {
        throw new Error('Not implemented!');
    }

    public setAttributes(attributes: { [key: string]: any }) {

        for (const key in attributes) {
            attributes['_' + key] = attributes[key];
            delete (attributes[key]);
        }

        Object.assign(this, attributes);
    }

    public getAttributes(names: string[] | undefined = undefined) {

        names ||= this.static.columns;

        const data: { [key: string]: string | number } = {};
        for (const name of names) {
            data[StringHelper.snakeToCamel(name)] = this['_' + name];
        }

        return data;
    }

    public async save(): Promise<boolean> {
        const data: Columns = {};
        this.static.columns.forEach(col => {
            if (this['_' + col] === undefined) {
                return;
            }

            data[col] = this['_' + col];
        });

        if (this._isNew) {
            const rows = await
                Command
                    .insert()
                    .into(this.static.tableName())
                    .columns(data)
                    .execute();

            if (rows === undefined || !rows.length) {
                return false;
            }

            const row = rows[0];

            for (const key in row) {
                this['_' + key] = row[key];
            }

            this._isNew = false;

            return true;
        }

        return await
            Command
                .update()
                .table(this.static.tableName())
                .set(data)
                .where({ left: 'id', value: '=', right: this.id })
                .execute();
    }

    public async delete() {
        const data: Where[] = [];
        this.static.columns.forEach(col => {
            data.push({
                left: col,
                value: '=',
                right: this['_' + col]
            })
        });

        return await
            Command
                .delete()
                .from({ tableName: this.static.tableName() })
                .where({
                    operator: 'and',
                    operands: data
                })
                .execute();
    }

    public static async findOne<T extends ActiveRecord>(condition: Where): Promise<T | undefined> {
        let select: Select = {};
        this.columns.forEach(column => {
            select[column] = '_' + column;
        });

        const data = await new Query()
            .select(select)
            .from({ tableName: this.tableName() })
            .where(condition)
            .one();

        if (!data) {
            return undefined;
        }

        const model = Object.assign(new this(), data) as T;
        model._isNew = false;

        return model;
    }

    public static async findAll<T extends ActiveRecord>(condition: Where): Promise<T[] | undefined> {
        let select: Select = {};
        this.columns.forEach(column => {
            select[column] = '_' + column;
        });

        const data = await new Query()
            .select(select)
            .from({ tableName: this.tableName() })
            .where(condition)
            .orderBy({ column: 'id', direction: ActiveRecord.SORT_ASC })
            .all();

        if (!data) {
            return undefined;
        }

        const models: T[] = [];
        for (const row of data) {
            const model = Object.assign(new this(), row) as T;
            model._isNew = false;
            models.push(model);
        }

        return models;
    }
}