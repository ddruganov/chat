import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import LoginValidator from "../../../components/validators/auth/LoginValidator";

export default async function (req: Request, res: Response) {
    const loginValidator = new LoginValidator(req.body);

    res.json(new ExecutionResult(
        await loginValidator.validate(),
        { errors: loginValidator.errors }
    ).asJson());
}