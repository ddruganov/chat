import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import { INVALID_AUTH } from "../../../config/codes";
import TokenHelper from "../../../components/helpers/TokenHelper";
import MessageAllCollector from "../../../collectors/chat/MessageAllCollector";

export default async function (req: Request, res: Response) {
    const user = await TokenHelper.check(req, res);
    if (!user) {
        return res.send(new ExecutionResult(false, {}, {}, INVALID_AUTH).asJson());
    }

    const collectorData = await new MessageAllCollector().setRoomId(req.body.id).setPage(req.body.page).get();
    res.send(new ExecutionResult(true, collectorData).asJson());
}