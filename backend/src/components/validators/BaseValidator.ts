export default class BaseValidator {

    protected _value: any;
    protected _error: string;

    public async validate(): Promise<boolean> {
        return false;
    }

    public set value(value: any) {
        this._value = value;
    }

    public get error() {
        return this._error;
    }
}