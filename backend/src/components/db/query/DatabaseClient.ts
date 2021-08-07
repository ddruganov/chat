import { Client } from "pg";
import databaseConfig from "../../../config/database.config";

export default class DatabaseClient {

    private static client: Client;

    public static get instance() {
        if (!DatabaseClient.client) {
            DatabaseClient.client = new Client(databaseConfig);
            DatabaseClient.client.connect((err) => {
                err && console.log('pg connection error:', err.message, err.stack);
            });
        }

        return DatabaseClient.client;
    }

    public get static() {
        return <typeof DatabaseClient>this.constructor;
    }
}