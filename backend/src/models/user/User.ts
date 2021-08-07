import ActiveRecord from "../../components/db/ar/ActiveRecord";
import TableField from "../../components/decorators/TableFieldDecorator";
import DateValidator from "../../components/validators/base/DateValidator";
import EmailValidator from "../../components/validators/base/EmailValidator";
import PasswordValidator from "../../components/validators/base/PasswordValidator";
import RequiredValidator from "../../components/validators/base/RequiredValidator";
import StringValidator from "../../components/validators/base/StringValidator";

export default class User extends ActiveRecord {

    @TableField() id: number;
    @TableField() email: string;
    @TableField() password: string;
    @TableField() name: string;
    @TableField() signupDate: string;
    @TableField() lastSeen: string | null;
    @TableField() nick: string;

    public static tableName() {
        return 'user.user';
    }

    public get rules() {
        return [
            { columns: ['email', 'password', 'name', 'signupDate', 'nick'], validator: RequiredValidator },
            { columns: ['email'], validator: EmailValidator },
            { columns: ['password', 'name', 'nick'], validator: StringValidator },
            { columns: ['password'], validator: PasswordValidator },
            { columns: ['signupDate'], validator: DateValidator },
        ];
    }
}