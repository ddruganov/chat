export default class StringHelper {
    public static escape(data: any, char = '"') {
        if (typeof data === typeof '') {
            return (data as string).split('.').map(piece => char + piece + char).join('.')
        }

        return data;
    }

    public static isTableName(data: string) {
        return data.split('.').length > 1;
    }
}