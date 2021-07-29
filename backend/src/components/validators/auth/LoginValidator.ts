import User from "../../../models/user/User";
import EmailValidator from "../base/EmailValidator";
import BaseValidator from "../BaseValidator";
import LoginData from "./LoginData";

export default class LoginValidator extends BaseValidator {
    private email: string;
    private password: string;

    public get loginData(): LoginData {
        return {
            email: this.email,
            password: this.password
        }
    }

    constructor(loginData: LoginData) {
        super();

        this.email = loginData.email;
        this.password = loginData.password;
    }

    public async validate() {
        try {
            const emailValidator = new EmailValidator(this.email);
            if (!emailValidator.validate()) {
                throw new Error('Неверный формат');
            }

            const res = await User.findOne({ left: 'email', value: '=', right: this.email });
            if (!res) {
                throw new Error('Пользователь не найден');
            }
        }
        catch (e) {
            this._errors['email'] = (e as Error).message;
        }

        return false;
    }
}