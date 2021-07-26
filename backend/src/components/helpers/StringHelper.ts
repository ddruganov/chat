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
        return /^[a-z]+.[a-z]+$/.test(data) && data.split('.').length > 1;
    }
}