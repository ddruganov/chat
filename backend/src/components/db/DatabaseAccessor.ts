import { Client } from "pg";
import DatabaseClient from "./DatabaseClient";

export default class DatabaseAccessor {
    protected _db: DatabaseClient;

    public constructor() {
        this._db = DatabaseClient.get();
    }
}