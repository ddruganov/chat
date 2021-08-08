type WordCountConfig = {
    '1': string,
    '2-3-4': string,
    'else': string
};

export default class StringHelper {
    public static escape(data: any, char = '"') {
        if (typeof data === typeof '') {

            data = (<string>data).replace('"', '\"').replace("'", "\'");

            if (StringHelper.isTableName(data)) {
                return (data as string).split('.').map(piece => char + piece + char).join('.')
            }

            const escapedAggregate = StringHelper.escapeAggregateFunction(data);
            if (escapedAggregate !== undefined) {
                return escapedAggregate;
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

    public static escapeAggregateFunction(data: string): string | undefined {
        const aggregateFunctions = ['count', 'sum', 'min', 'avg', 'max'];

        for (const af of aggregateFunctions) {
            const regex = af + '\\((?<column>.*)\\)';
            const match = data.match(regex);
            if (!match) {
                continue;
            }
            return [af, '(', StringHelper.escape(match.groups?.column), ')'].join('');
        }

        return undefined;
    }

    public static snakeToCamel(data: string) {
        return data.split('_').map((s, i) => i === 0 ? s : (s.charAt(0).toUpperCase() + s.slice(1))).join('');
    }

    public static camelToSnake(data: string) {
        return data.split(/(?=[A-Z])/).map((s) => s.toLowerCase()).join('_');
    }

    public static getWordCount(value: number, config: WordCountConfig) {
        let lastTwoDigits = value % 100;
        if (lastTwoDigits > 20) {
            lastTwoDigits %= 10;
        }

        let result = value + ' ';

        if (lastTwoDigits === 1) {
            result += config[1];
        } else if ([2, 3, 4].includes(lastTwoDigits)) {
            result += config["2-3-4"];
        } else {
            result += config.else;
        }

        return result;
    }
}