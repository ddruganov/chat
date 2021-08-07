import Command from "../commands/Command";

export default class Transaction {

    public async begin() {
        await new Command('begin transaction').execute();
        return this;
    }

    public async commit() {
        await new Command('commit transaction').execute();
    }

    public async rollback() {
        await new Command('rollback transaction').execute();
    }
}