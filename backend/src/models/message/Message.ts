import User from "../user/User";

export class Message {
    constructor(private from: User, private content: string) { }
}