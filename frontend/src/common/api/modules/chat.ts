import Requestor from "@/common/service/requestor";

export default class ChatApi {
  loadRooms = () => Requestor.post('/chat/loadRooms');
  loadRoomMessages = (id: number, page: number) => Requestor.post('/chat/loadRoomMessages', { id: id, page: page });

  deleteRoom = (id: number) => Requestor.post('/chat/deleteRoom', { id: id });
}
