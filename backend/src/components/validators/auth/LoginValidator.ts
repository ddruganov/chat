import User from "../../../models/user/User";
import PasswordHelper from "../../helpers/PasswordHelper";
import EmailValidator from "../base/EmailValidator";
import BaseValidator from "../BaseValidator";
import LoginData from "./LoginData";

export default class LoginValidator extends BaseValidator {
    private email: string;
    private password: string;
    private user: User;

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

            const res = await User.findOne<User>({ left: 'email', value: '=', right: this.email });
            if (!res) {
                throw new Error('Неверный логин');
            }

            this.user = res;
        }
        catch (e) {
            this._errors['email'] = (e as Error).message;
        }

        try {
            if (!PasswordHelper.verify(this.password, this.user?.password)) {
                throw new Error('Неверный пароль');
            }
        }
        catch (e) {
            this._errors['password'] = (e as Error).message;
        }

        return !Object.keys(this._errors).length;
    }
}