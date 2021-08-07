import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import { INVALID_AUTH } from "../../../config/codes";
import TokenHelper from "../../../components/helpers/TokenHelper";
import Room from "../../../models/chat/Room";
import Transaction from "../../../components/db/query/Transaction";

export default async function (req: Request, res: Response) {
    const user = await TokenHelper.check(req, res);
    if (!user) {
        return res.send(new ExecutionResult(false, {}, {}, INVALID_AUTH).asJson());
    }

    const room = await Room.findOne<Room>({ left: "id", value: '=', right: req.body.id });
    if (!room) {
        res.send(new ExecutionResult(false, {}, { common: 'Чат не найден' }).asJson());
        return;
    }

    const transaction = await new Transaction().begin();
    const deleteSuccess = await room.delete();
    await (deleteSuccess ? transaction.commit() : transaction.rollback());

    res.send(new ExecutionResult(deleteSuccess).asJson());
}