export default class StringHelper {
    public static escape(data: any, char = '"') {
        if (typeof data === typeof '') {

            data = (<string>data).replace('"', '\"').replace("'", "\'");

            if (StringHelper.isTableName(data)) {
                return (data as string).split('.').map(piece => char + piece + char).join('.')
            }

            return [char, char].join(data);
        }

        if ([null, undefined].some(nullish => data === nullish)) {
            return String(null);
        }

        return data;
    }

    public static isTableName(data: string) {

        const regex = (data.match(/\w+.?\w+/) || [])[0] === data;
        const splitLength = data.split('.').length;

        return regex && splitLength > 1;
    }

    public static snakeToCamel(data: string) {
        return data.split('_').map((s, i) => i === 0 ? s : (s.charAt(0).toUpperCase() + s.slice(1))).join('');
    }

    public static camelToSnake(data: string) {
        return data.split(/(?=[A-Z])/).map((s) => s.toLowerCase()).join('_');
    }
}