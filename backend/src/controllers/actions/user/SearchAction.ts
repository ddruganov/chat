import { Request, response, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import { INVALID_AUTH } from "../../../config/codes";
import TokenHelper from "../../../components/helpers/TokenHelper";
import User from "../../../models/user/User";

export default async function SearchAction(req: Request, res: Response) {
    const user = await TokenHelper.check(req, res);
    if (!user) {
        return res.send(new ExecutionResult(false, {}, {}, INVALID_AUTH).asJson());
    }

    const result = await User.findAll({
        operator: 'and',
        operands: [
            {
                left: 'nick',
                value: 'ilike',
                right: req.body.search
            },
            {
                left: 'id',
                value: '<>',
                right: user.id
            },
        ]
    }) || [];

    res.send(new ExecutionResult(true, result?.map(u => u.getAttributes())).asJson());
}