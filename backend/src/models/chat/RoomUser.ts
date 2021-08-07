import ActiveRecord from "../../components/db/ar/ActiveRecord";
import TableField from "../../components/decorators/TableFieldDecorator";
import RequiredValidator from "../../components/validators/base/RequiredValidator";
import User from "../user/User";
import Room from "./Room";

export default class RoomUser extends ActiveRecord {

    @TableField() id: number;
    @TableField() roomId: number;
    @TableField() userId: number;
    @TableField() joinDate: string;

    public static tableName() {
        return 'chat.room_user';
    }

    public get rules() {
        return [
            { columns: ['roomId', 'userId', 'joinDate'], validator: RequiredValidator }
        ];
    }

    public get room() {
        return new Promise(async (resolve) => {
            const room = await Room.findOne<Room>({ left: 'id', value: '=', right: this.roomId });
            resolve(room);
        });
    }

    public get user() {
        return new Promise(async (resolve) => {
            const user = await User.findOne<User>({ left: 'id', value: '=', right: this.userId });
            resolve(user);
        });
    }
}