import DatabaseClient from "./DatabaseClient";

export default class DatabaseAccessor {
    protected get _db() {
        return DatabaseClient.instance;
    }
}