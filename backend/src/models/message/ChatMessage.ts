import User from "../user/User";
import { Message } from "./message";

export class ChatMessage extends Message {
    constructor(from: User, content: string) {
        super(from, content);
    }
}