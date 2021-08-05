export default class DateHelper {
    public static now() {
        return DateHelper.convert(new Date()).toUTCString();
    }

    public static nowt() {
        return DateHelper.convert(new Date()).getTime();
    }

    public static nowAsJSDate() {
        return DateHelper.convert(new Date());
    }

    public static convert(date: Date) {
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ));
    }

    public static fromTimestamp(timestamp: number) {
        return DateHelper.convert(new Date(timestamp)).toUTCString();
    }
}