import Requestor from "@/common/service/requestor";

export default class ChatApi {
  loadRooms = () => Requestor.post('/chat/loadRooms');
  loadRoomMessages = (id: number) => Requestor.post('/chat/loadRoomMessages', { id: id });

  deleteRoom = (id: number) => Requestor.post('/chat/deleteRoom', { id: id });
}
