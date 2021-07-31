import Requestor from "@/common/service/requestor";

export default class MessageApi {
  loadRooms = () => Requestor.post('/message/loadRooms');

  loadRoomMessages = (id: number) => Requestor.post('/message/loadRooloadRoomMessagesm', { id: id });
}
