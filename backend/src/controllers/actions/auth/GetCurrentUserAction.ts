import { Request, response, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import jwtConfig from "../../../config/jwt.config";
import jwt from 'jsonwebtoken';
import User from "../../../models/user/User";
import { INVALID_AUTH } from "../../../config/codes";
import CurrentUserCollector from "../../../collectors/user/CurrentUserCollector";

export default async function (req: Request, res: Response) {
    const token = req.cookies['X-Access-Token'];

    if (!token) {
        return res.send(new ExecutionResult(false, {}, { code: INVALID_AUTH }).asJson());
    }

    jwt.verify(token, jwtConfig.secret, async function (err: any, decoded: any) {
        if (err) {
            return res.send(new ExecutionResult(false, {}, { code: INVALID_AUTH }).asJson());
        }

        const user = await User.findOne({ left: 'id', value: '=', right: decoded.userId });
        if (!user) {
            return res.send(new ExecutionResult(true, {}, { common: 'User not found' }).asJson());
        }

        res.send(new ExecutionResult(true, new CurrentUserCollector().setUser(user).get()).asJson());
    })
}