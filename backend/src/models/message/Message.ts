import User from "@/models/user/User";

export default class Message {
  constructor(private from: User, private content: string) {}
}
