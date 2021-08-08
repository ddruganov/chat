import StringHelper from "./StringHelper";

export default class DateHelper {
    public static now() {
        return DateHelper.format(DateHelper.convert());
    }

    public static nowt() {
        return DateHelper.convert().getTime();
    }

    public static nowAsJSDate() {
        return DateHelper.convert();
    }

    public static convert(date: Date = new Date()) {
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ));
    }

    public static format(date: Date) {
        return [
            [
                date.getUTCFullYear(),
                String(date.getUTCMonth() + 1).padStart(2, '0'),
                String(date.getUTCDate()).padStart(2, '0'),
            ].join('-'),
            [
                String(date.getUTCHours()).padStart(2, '0'),
                String(date.getUTCMinutes()).padStart(2, '0'),
                String(date.getUTCSeconds()).padStart(2, '0')
            ].join(':')
        ].join(' ');
    }

    public static fromTimestamp(timestamp: number) {
        return DateHelper.format(DateHelper.convert(new Date(timestamp)));
    }

    public static verbose(value: string) {
        const { 0: date, 1: time } = value.split(' ');
        const splitDate = date.split('-');
        const splitTime = time.split(':');

        const convertedDate = [splitDate[2], DateHelper.months['genetive'][Number(splitDate[1]) - 1], splitDate[0]];
        const convertedTime = [splitTime[0], splitTime[1]].join(':');

        return [...convertedDate, 'в', convertedTime].join(' ');
    }

    private static months = {
        genetive: [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'декабря',
        ]
    };
}