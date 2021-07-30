import { DateTime } from "luxon";

export default class DateHelper {
    public static now() {
        return DateTime.now().toSQL({ includeOffset: false });
    }

    public static nowAsDate() {
        const d = new Date();
        return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
    }

    public static nowt() {
        return DateTime.now().toMillis();
    }
}