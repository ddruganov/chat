export default class BaseValidator {

    protected _errors: { [key: string]: string } = {};

    public async validate(): Promise<boolean> {
        return false;
    }

    public get errors() {
        return this._errors;
    }
}