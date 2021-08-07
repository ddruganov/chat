import BaseValidator from "../BaseValidator";

export default class NumberValidator extends BaseValidator {
    public async validate() {
        const isValid = typeof this._value === typeof 0;
        !isValid && (this._error = 'Поле не является числом');

        return isValid;
    }
}