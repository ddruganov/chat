type WordCountConfig = {
    '1': string,
    '2-3-4': string,
    'else': string
};

export default class StringHelper {
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