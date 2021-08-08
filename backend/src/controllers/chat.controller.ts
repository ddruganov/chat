import Controller from '../components/decorators/ControllerDecorator';
import ControllerInterface from '../components/routing/controller.interface';
import RequestMethod from '../components/routing/request.method';
import DeleteRoomAction from './actions/chat/DeleteRoomAction';
import LoadRoomMessagesAction from './actions/chat/LoadRoomMessagesAction';
import LoadRoomsAction from './actions/chat/LoadRoomsAction';

@Controller
export default class ChatController implements ControllerInterface {
    public get routes() {
        return {
            'loadRooms': {
                method: RequestMethod.post,
                handler: LoadRoomsAction
            },
            'loadRoomMessages': {
                method: RequestMethod.post,
                handler: LoadRoomMessagesAction
            },
            'deleteRoom': {
                method: RequestMethod.post,
                handler: DeleteRoomAction
            }
        };
    }
}