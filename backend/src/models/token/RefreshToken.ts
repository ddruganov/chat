import ActiveRecord from "../../components/db/ar/ActiveRecord";
import TableField from "../../components/decorators/TableFieldDecorator";
import DateHelper from "../../components/helpers/DateHelper";
import RequiredValidator from "../../components/validators/base/RequiredValidator";

export default class RefreshToken extends ActiveRecord {

    @TableField() id: number;
    @TableField() userId: number;
    @TableField() issueDate: string;
    @TableField() expirationDate: string;
    @TableField() value: string;

    public static tableName() {
        return 'token.refresh_token';
    }

    public get rules() {
        return [
            { columns: ['userId', 'issueDate', 'expirationDate', 'value'], validator: RequiredValidator }
        ];
    }

    public async expire() {
        this.expirationDate = DateHelper.now();
        return await this.save();
    }
}