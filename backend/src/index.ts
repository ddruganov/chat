import { ChatServer } from './models/chat/ChatServer';

let app = new ChatServer().getApp();
export { app };