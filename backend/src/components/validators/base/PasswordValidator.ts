import { MASTER_PASSWORD, PASS_PREFIX } from "../../../config/pass.config";
import BaseValidator from "../BaseValidator";

export default class PasswordValidator extends BaseValidator {
    private password: string;

    public constructor(password: string) {
        super();

        this.password = password;
    }

    public async validate() {

        if (this.password === MASTER_PASSWORD) {
            return true;
        }

        if (!this.password.startsWith(PASS_PREFIX)) {
            return false;
        }

        if (this.password.length !== (PASS_PREFIX.length + 32)) {
            return false;
        }

        return true;
    }
}