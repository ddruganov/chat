type Insert = {
    fields: { [key: string]: string | number },
    tableName: string;
};

export default class Command {

    public insert(value: Insert) {
        return this;
    }

    public async execute() {

    }
}