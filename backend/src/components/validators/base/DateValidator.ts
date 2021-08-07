import BaseValidator from "../BaseValidator";

export default class DateValidator extends BaseValidator {
    public async validate() {
        const isValid = Date.parse(this._value).valueOf().toString() !== NaN.toString();
        !isValid && (this._error = 'Неверный формат даты');

        return isValid;
    }
}