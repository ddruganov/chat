import ActiveRecord from "../../components/db/ar/ActiveRecord";
import TableField from "../../components/decorators/TableFieldDecorator";
import RequiredValidator from "../../components/validators/base/RequiredValidator";

export default class Message extends ActiveRecord {

    @TableField() id: number;
    @TableField() creationDate: string;
    @TableField() userId: number;
    @TableField() roomId: number;
    @TableField() contents: string;

    public static tableName() {
        return 'chat.message';
    }

    public get rules() {
        return [
            { columns: ['creationDate', 'userId', 'roomId', 'contents'], validator: RequiredValidator }
        ];
    }
}