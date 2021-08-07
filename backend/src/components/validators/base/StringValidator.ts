import BaseValidator from "../BaseValidator";

export default class StringValidator extends BaseValidator {
    public async validate() {
        const isValid = typeof this._value === typeof '';
        !isValid && (this._error = 'Поле не является строкой');

        return isValid;
    }
}