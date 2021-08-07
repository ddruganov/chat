import { PASS_PREFIX } from "../../../config/pass.config";
import BaseValidator from "../BaseValidator";

export default class PasswordValidator extends BaseValidator {
    public async validate() {
        if (!this._value.startsWith(PASS_PREFIX)) {
            this._error = 'Пароль должен начинаться со спецаильного префикса';
            return false;
        }

        if (this._value.length !== (PASS_PREFIX.length + 32)) {
            this._error = 'Пароль не захеширован';
            return false;
        }

        return true;
    }
}