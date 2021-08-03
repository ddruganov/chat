import Controller from '../components/decorators/ControllerDecorator';
import ControllerInterface from '../components/routing/controller.interface';
import RequestMethod from '../components/routing/request.method';
import LoadRoomsAction from './actions/message/LoadRoomsAction';

@Controller
export default class MessageController implements ControllerInterface {
    public get routes() {
        return {
            'loadRooms': {
                method: RequestMethod.post,
                handler: LoadRoomsAction
            },
        };
    }
}