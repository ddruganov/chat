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
}