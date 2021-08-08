import ActiveRecord from "../../components/db/ar/ActiveRecord";
import Query from "../../components/db/query/Query";
import DateHelper from "../../components/helpers/DateHelper";
import Message from "../../models/chat/Message";
import BaseCollector from "../base/BaseCollector";


export default class MessageAllCollector extends BaseCollector {
    private roomId: number;
    private page: number;
    private static readonly LIMIT_PER_PAGE = 15;

    public async get() {
        const query = new Query()
            .from({ tableName: Message.tableName() })
            .where({ left: 'room_id', value: '=', right: this.roomId });

        const messageCount = Number(await query.select({ 'count(id)': 'count' }).scalar())!;
        const offset = messageCount - (this.page * MessageAllCollector.LIMIT_PER_PAGE);

        if (offset < -MessageAllCollector.LIMIT_PER_PAGE) {
            return [];
        }

        const messages = await query
            .select({
                id: 'id',
                creation_date: 'creationDate',
                user_id: 'userId',
                contents: 'contents'
            })
            .limit(MessageAllCollector.LIMIT_PER_PAGE)
            .offset(offset < 0 ? 0 : offset)
            .orderBy({ column: 'id', direction: ActiveRecord.SORT_ASC })
            .all() || [];

        for (let message of messages) {
            message.creationDate = DateHelper.verbose(message.creationDate);
        }

        return messages;
    }

    public setRoomId(value: number) {
        this.roomId = value;
        return this;
    }

    public setPage(value: number) {
        this.page = value;
        return this;
    }
}