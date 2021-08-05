import ActiveRecord from "../../components/db/ActiveRecord";
import Command from "../../components/db/Command";
import DateHelper from "../../components/helpers/DateHelper";
import RoomCreationConfig from "../../types/chat/RoomCreationConfig";
import User from "../user/User";
import Message from "./Message";
import RoomUser from "./RoomUser";

export default class Room extends ActiveRecord {

    private _id: number;
    private _name: string;
    private _creator_id: number;
    private _creation_date: string;

    public static tableName() {
        return 'chat.room';
    }

    public static get columns() {
        return ['id', 'name', 'creator_id', 'creation_date'];
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public get creatorId() {
        return this._creator_id;
    }

    public get creator() {
        return new Promise(async (resolve) => {
            const user = await User.findOne<User>({ left: 'id', value: '=', right: this.creatorId });
            resolve(user);
        });
    }

    public get creationDate() {
        return this._creation_date;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set creatorId(value: number) {
        this._creator_id = value;
    }

    public set creationDate(value: string) {
        this._creation_date = value;
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