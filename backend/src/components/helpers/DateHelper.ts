export default class DateHelper {
    public static now() {
        return new Date().toISOString().split('T').map(piece => piece.split('.')[0]).join(' ');
    }
}