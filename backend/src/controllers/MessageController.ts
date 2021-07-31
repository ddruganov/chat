import express from 'express';
import LoadRoomsAction from './actions/message/LoadRoomsAction';

const MessageController = express.Router();
MessageController.post('/loadRooms', LoadRoomsAction);

export default MessageController;