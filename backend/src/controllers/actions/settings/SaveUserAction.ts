import { Request, response, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import { INVALID_AUTH } from "../../../config/codes";
import TokenHelper from "../../../components/helpers/TokenHelper";

export default async function (req: Request, res: Response) {
    const user = await TokenHelper.check(req, res);
    if (!user) {
        return res.send(new ExecutionResult(false, {}, {}, INVALID_AUTH).asJson());
    }

    user.setAttributes(req.body.user);
    const saveSuccess = await user.save();

    res.send(new ExecutionResult(saveSuccess, { errors: user.firstErrors }).asJson());
}