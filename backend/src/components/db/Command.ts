import InsertCommand from "./InsertCommand";
import UpdateCommand from "./UpdateCommand";

export default class Command {
    public insert() {
        return new InsertCommand();
    }

    public update() {
        return new UpdateCommand();
    }
}