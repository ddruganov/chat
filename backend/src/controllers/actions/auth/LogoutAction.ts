import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import TokenHelper from "../../../components/helpers/TokenHelper";

export default async function (req: Request, res: Response) {
    const user = await TokenHelper.check(req, res);
    if (user) {
        await TokenHelper.purge(req, res, user);
    }

    return res.send(new ExecutionResult(true).asJson());
}