import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import { INVALID_AUTH } from "../../../config/codes";
import TokenHelper from "../../../components/helpers/TokenHelper";
import RoomAllCollector from "../../../collectors/message/RoomAllCollector";

export default async function (req: Request, res: Response) {
    const user = await TokenHelper.check(req, res);
    if (!user) {
        return res.send(new ExecutionResult(false, {}, {}, INVALID_AUTH).asJson());
    }

    const collectorData = await new RoomAllCollector().setUser(user).get();
    res.send(new ExecutionResult(true, collectorData).asJson());
}