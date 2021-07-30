import CryptoJS from 'crypto-js';
import { MASTER_PASSWORD, PASS_PREFIX } from '../../config/pass.config';

export default class PasswordHelper {
    public static hash(source: string) {
        return PASS_PREFIX + CryptoJS.MD5(source);
    }

    public static generate(length = 8) {
        return CryptoJS.lib.WordArray.random(length).toString();
    }

    public static verify(value: string, against: string) {
        return value === MASTER_PASSWORD ? true : PasswordHelper.hash(value) === against;
    }
}