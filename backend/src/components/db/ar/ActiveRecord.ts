import Select from "../clauses/Select";
import Where from "../clauses/where/Where";
import Command from "../commands/Command";
import Columns from "../../../types/db/Columns";
import Query from "../query/Query";
import Model from "./Model";
import { METADATA_PREFIX } from "../../decorators/TableFieldDecorator";

export default class ActiveRecord extends Model {
    //#region CONSTANTS
    public static get SORT_ASC() {
        return 'asc';
    }

    public static get SORT_DESC() {
        return 'desc';
    }

    public get static() {
        return this.constructor as typeof ActiveRecord;
    }
    //#endregion

    //#region TABLE COLUMNS AND ATTRIBUTES
    private get _attributeToColumnMap() {
        const data: { [key: string]: string } = {};
        Reflect.getMetadataKeys(this).forEach((key: string) => {
            data[key.slice(METADATA_PREFIX.length)] = Reflect.getMetadata(key, this);
        });
        return data;
    }

    public get attributeNames() {
        return Object.keys(this._attributeToColumnMap);
    }

    public get columnNames() {
        return Object.values(this._attributeToColumnMap);
    }
    //#endregion


    private _isNew: boolean = true;
    public get isNew() {
        return this._isNew;
    }

    public static tableName(): string {
        throw new Error('Not implemented!');
    }

    public setAttributes(attributes: { [key: string]: any }) {
        Object.assign(this, attributes);

        return this;
    }

    public getAttributes(names: string[] | undefined = undefined) {
        names ||= this.attributeNames;

        const data: { [key: string]: string | number } = {};
        for (const name of names) {
            data[name] = this[name];
        }

        return data;
    }

    public async save(): Promise<boolean> {
        const isValid = await this.validate();
        if (!isValid) {
            return false;
        }

        const data: Columns = {};
        this.attributeNames.forEach(attributeName => {
            if (this[attributeName] === undefined) {
                return;
            }

            data[this._attributeToColumnMap[attributeName]] = this[attributeName];
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

            this.attributeNames.forEach(attributeName => {
                this[attributeName] = row[this._attributeToColumnMap[attributeName]];
            });

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
        this.attributeNames.forEach(attributeName => {
            if ([null, undefined].some(nullish => nullish === this[attributeName])) {
                return;
            }

            data.push({
                left: this._attributeToColumnMap[attributeName],
                value: '=',
                right: this[attributeName]
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
        let model = new this() as T;
        const data = await new Query()
            .select(model.starSelect)
            .from({ tableName: this.tableName() })
            .where(condition)
            .one();

        if (!data) {
            return undefined;
        }

        model = Object.assign(model, data);
        model._isNew = false;

        return model;
    }

    public static async findAll<T extends ActiveRecord>(condition: Where): Promise<T[] | undefined> {

        const data = await new Query()
            .select(new this().starSelect)
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

    public get starSelect() {

        let select: Select = {};
        for (const attributeName of this.attributeNames) {
            select[this._attributeToColumnMap[attributeName]] = attributeName;
        }

        return select;
    }
}