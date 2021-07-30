import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from "../../config/jwt.config";
import AccessToken from '../../models/token/AccessToken';
import RefreshToken from '../../models/token/RefreshToken';
import User from "../../models/user/User";
import DateHelper from './DateHelper';

export default class TokenHelper {
    constructor() {
        throw new Error('This class cannot be instantiated');
    }

    public static async generate(res: Response, user: User) {
        const accessTokenExpirationTimestamp = DateHelper.now().getTime() + jwtConfig.accessTokenLifetime;
        const accessToken = jwt.sign({ userId: user.id, expiresAt: accessTokenExpirationTimestamp }, jwtConfig.secret);
        res.cookie('X-Access-Token', accessToken, {
            httpOnly: true,
            expires: new Date(accessTokenExpirationTimestamp),
            sameSite: 'lax',
            secure: false
        });
        const accessTokenAr = new AccessToken({
            value: accessToken,
            isBlacklisted: false
        });
        const accessTokenSaveRes = await accessTokenAr.save();
        if (!accessTokenSaveRes) {
            return false;
        }

        const refreshTokenExpirationTimestamp = DateHelper.now().getTime() + jwtConfig.refreshTokenLifetime;
        const refreshToken = jwt.sign({ accessToken: accessToken, expiresAt: refreshTokenExpirationTimestamp }, jwtConfig.secret, { expiresIn: jwtConfig.refreshTokenLifetime });
        res.cookie('X-Refresh-Token', refreshToken, {
            httpOnly: true,
            expires: new Date(refreshTokenExpirationTimestamp),
            sameSite: 'lax',
            secure: false
        });
        const refreshTokenAr = new RefreshToken({
            userId: user.id,
            issueDate: DateHelper.now().toUTCString(),
            expirationDate: new Date(refreshTokenExpirationTimestamp).toUTCString(),
            value: refreshToken
        });
        const refreshTokenSaveRes = await refreshTokenAr.save();
        if (!refreshTokenSaveRes) {
            return false;
        }

        return true;
    }

    public static purge(res: Response, user: User) {
        res.cookie('X-Access-Token', undefined, {
            httpOnly: true,
            expires: DateHelper.now(),
            sameSite: 'lax',
            secure: false
        });
        res.cookie('X-Refresh-Token', undefined, {
            httpOnly: true,
            expires: DateHelper.now(),
            sameSite: 'lax',
            secure: false
        });
    }

    public static async check(req: Request, res: Response): Promise<User | undefined> {
        const accessToken = req.cookies['X-Access-Token'];
        if (!accessToken) {
            return undefined;
        }

        const accessTokenAr = await AccessToken.findOne<AccessToken>({ left: 'value', value: '=', right: accessToken });
        if (!accessTokenAr) {
            return undefined;
        }

        const verifyRes: any = await new Promise((resolve, reject) => {
            jwt.verify(accessToken, jwtConfig.secret, (err: any, decoded: any) => err ? reject(undefined) : resolve(decoded));
        })
        if (!verifyRes) {
            return undefined;
        }

        const user = (await User.findOne<User>({ left: 'id', value: '=', right: verifyRes.userId }))!;

        const now = DateHelper.now().getTime();
        const accessTokenExpirationTimestamp = verifyRes.expiresAt;

        if (now > accessTokenExpirationTimestamp) {
            // mark access token as blacklisted
            accessTokenAr.isBlacklisted = true;
            await accessTokenAr.save();

            // check refresh token
            const refreshToken = req.cookies['X-Refresh-Token'];
            if (!refreshToken) {
                return undefined;
            }

            const refreshTokenAr = await RefreshToken.findOne<RefreshToken>({ left: 'value', value: '=', right: refreshToken });
            if (!refreshTokenAr || refreshTokenAr.userId !== user.id) {
                return undefined;
            }

            const refreshTokenVerify: any = await new Promise((resolve, reject) => {
                jwt.verify(refreshToken, jwtConfig.secret, (err: any, decoded: any) => err ? reject(err) : resolve(decoded));
            });

            const refreshTokenExpirationTimestamp = refreshTokenVerify.expiresAt;
            if (now > refreshTokenExpirationTimestamp) {
                TokenHelper.purge(res, user);
                return undefined;
            }

            refreshTokenAr.expirationDate = DateHelper.now().toUTCString();
            await refreshTokenAr.save();

            await TokenHelper.generate(res, user);
        }

        return user;
    }
}