import Command from "./Command";
import DatabaseClient from "./DatabaseClient";

export default class Transaction {

    public async begin() {
        DatabaseClient.isTransactional = true;
        await new Command('begin transaction').execute();
        return this;
    }

    public async commit() {
        await new Command('commit transaction').execute();
        await this.reset();
    }

    public async rollback() {
        await new Command('rollback transaction').execute();
        await this.reset();
    }

    private async reset() {
        DatabaseClient.isTransactional = false;
        await DatabaseClient.currentClient?.end();
    }
}