import { Client } from "pg";
import databaseConfig from "../../config/database.config";

export default class DatabaseClient {

    public static isTransactional = false;
    private static _currentClient?: Client;
    public static get currentClient() {
        return DatabaseClient._currentClient;
    }

    public static get() {
        if (!DatabaseClient.isTransactional || !DatabaseClient._currentClient) {
            DatabaseClient._currentClient = new Client(databaseConfig);
            DatabaseClient._currentClient.connect((err) => {
                err && console.log('pg connection error:', err.message, err.stack);
            });
        }

        return new DatabaseClient();
    }

    public async query(sql: string) {

        if (!DatabaseClient._currentClient) {
            throw new Error('DatabaseClient has not been initialized properly');
        }

        const res = await DatabaseClient._currentClient.query(sql);

        if (!DatabaseClient.isTransactional) {
            await DatabaseClient._currentClient.end();
            DatabaseClient._currentClient = undefined;
        }

        return res;
    }
}