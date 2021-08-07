import BaseValidator from "../BaseValidator";

export default class RequiredValidator extends BaseValidator {
    public async validate() {
        const isValid = !this.isNullish() && !this.isEmptyString();
        !isValid && (this._error = 'Поле должно обязательно содержать значение');

        return isValid;
    }

    private isNullish() {
        return [undefined, null, ''].some(nullish => this._value === nullish);
    }

    private isEmptyString() {
        if (typeof this._value !== typeof '') {
            return false;
        }

        return (<string>this._value).trim() === '';
    }
}