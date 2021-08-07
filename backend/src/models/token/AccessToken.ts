import ActiveRecord from "../../components/db/ar/ActiveRecord";
import TableField from "../../components/decorators/TableFieldDecorator";
import RequiredValidator from "../../components/validators/base/RequiredValidator";

export default class AccessToken extends ActiveRecord {

    @TableField() id: number;
    @TableField() value: string;
    @TableField() isBlacklisted: boolean;

    public static tableName() {
        return 'token.access_token';
    }

    public get rules() {
        return [
            { columns: ['value', 'isBlacklisted'], validator: RequiredValidator }
        ];
    }

    public async blacklist() {
        this.isBlacklisted = true;
        return await this.save();
    }
}