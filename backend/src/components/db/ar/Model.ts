import ModelRule from "../../../types/db/ModelRule";
import ModelErrors from "../../../types/db/ModelErrors";

export default class Model {

    [key: string]: any;

    public constructor(config: { [key: string]: any } = {}) {
        Object.assign(this, config);
    }

    public get static() {
        return <typeof Model>this.constructor;
    }

    protected _errors: ModelErrors = {};
    public get errors() {
        return this._errors;
    }

    public get firstErrors() {
        const data: { [key: string]: string } = {};
        for (const key in this._errors) {
            data[key] = this._errors[key][0];
        }

        return data;
    }

    public get rules(): ModelRule[] {
        throw new Error('Not implemented');
    };

    public async validate() {
        for (const rule of this.rules) {
            const validator = new rule.validator();
            for (const column of rule.columns) {
                validator.value = this[column];
                if (!(await validator.validate())) {
                    this.errors[column] ||= [];
                    this.errors[column].push(validator.error);
                }
            }
        }

        return !Object.keys(this._errors).length;
    }
}