import ActiveRecord from "../db/ar/ActiveRecord";
import StringHelper from "../helpers/StringHelper";
import "reflect-metadata";

export const METADATA_PREFIX = 'activeRecordAttribute:';

export default function TableField(camelToSnake = true) {
    return (target: ActiveRecord, propertyName: string) => {
        const value = camelToSnake ? StringHelper.camelToSnake(propertyName) : propertyName;
        Reflect.defineMetadata(METADATA_PREFIX + propertyName, value, target);
    }
}