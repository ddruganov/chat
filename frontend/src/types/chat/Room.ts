import User from "../auth/User";
import Message from "./Message";

type Room = {
  id: number;
  name: string;
  creatorId: number;
  creationDate: string;
  messages: Message[];
  users: User[];
};
export default Room;
