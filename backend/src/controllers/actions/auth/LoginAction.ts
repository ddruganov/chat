import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import LoginValidator from "../../../components/validators/auth/LoginValidator";
import User from "../../../models/user/User";
import TokenGenerator from "../../../components/helpers/TokenHelper";

export default async function (req: Request, res: Response) {
    const loginValidator = new LoginValidator(req.body);

    const isValid = await loginValidator.validate();

    if (!isValid) {
        return res.json(new ExecutionResult(false, { errors: loginValidator.errors }).asJson());
    }

    // user is always defined after login validation is complete
    const user = (await User.findOne<User>({ left: 'email', value: '=', right: loginValidator.loginData.email }))!;

    await TokenGenerator.generate(res, user);

    res.send(new ExecutionResult(true).asJson());
}