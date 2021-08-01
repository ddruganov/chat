export default class StringHelper {
    public static escape(data: any, char = '"') {
        if (typeof data === typeof '') {
            if (StringHelper.isTableName(data)) {
                return (data as string).split('.').map(piece => char + piece + char).join('.')
            }

            return char + data + char;
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
}