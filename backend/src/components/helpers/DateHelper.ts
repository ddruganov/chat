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
                ('0' + (date.getUTCMonth() + 1)).slice(0, 2),
                ('0' + date.getUTCDate()).slice(0, 2)
            ].join('-'),
            [
                ('0' + date.getUTCHours()).slice(0, 2),
                ('0' + date.getUTCMinutes()).slice(0, 2),
                ('0' + date.getUTCSeconds()).slice(0, 2)
            ].join(':')
        ].join(' ');
    }

    public static fromTimestamp(timestamp: number) {
        return DateHelper.format(DateHelper.convert(new Date(timestamp)));
    }
}