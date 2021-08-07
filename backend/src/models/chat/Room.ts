import ActiveRecord from "../../components/db/ar/ActiveRecord";
import Command from "../../components/db/commands/Command";
import TableField from "../../components/decorators/TableFieldDecorator";
import DateHelper from "../../components/helpers/DateHelper";
import RequiredValidator from "../../components/validators/base/RequiredValidator";
import RoomCreationConfig from "../../types/chat/RoomCreationConfig";
import User from "../user/User";
import Message from "./Message";
import RoomUser from "./RoomUser";

export default class Room extends ActiveRecord {

    @TableField() id: number;
    @TableField() name: string;
    @TableField() creatorId: number;
    @TableField() creationDate: string;

    public static tableName() {
        return 'chat.room';
    }

    public get rules() {
        return [
            { columns: ['name', 'creatorId', 'creationDate'], validator: RequiredValidator }
        ];
    }

    public get creator() {
        return new Promise(async (resolve) => {
            const user = await User.findOne<User>({ left: 'id', value: '=', right: this.creatorId });
            resolve(user);
        });
    }

    public async delete() {
        const deleteMessagesSuccess = await Command
            .delete()
            .from({ tableName: Message.tableName() })
            .where({
                left: 'room_id',
                value: '=',
                right: this.id
            })
            .execute();

        const deleteRoomUserSuccess = await Command
            .delete()
            .from({ tableName: RoomUser.tableName() })
            .where({
                left: 'room_id',
                value: '=',
                right: this.id
            })
            .execute();

        return deleteMessagesSuccess && deleteRoomUserSuccess && super.delete();
    }

    public static async new(data: RoomCreationConfig) {
        const model = new Room({
            name: 'Room',
            creatorId: data.creatorId,
            creationDate: DateHelper.now()
        });
        if (!(await model.save())) {
            return undefined;
        }

        model.name = `Room #${model.id}`;
        if (!(await model.save())) {
            return undefined;
        }

        const userIds = [data.creatorId, data.with];

        for (const userId of userIds) {
            const user = await User.findOne<User>({ left: 'id', value: '=', right: userId });
            if (!user) {
                return undefined;
            }

            const roomUser = new RoomUser({
                roomId: model.id,
                userId: userId,
                joinDate: DateHelper.now()
            });
            if (!(await roomUser.save())) {
                return undefined;
            }
        }

        return model;
    }
}