import Controller from '../components/decorators/ControllerDecorator';
import ControllerInterface from '../components/routing/controller.interface';
import RequestMethod from '../components/routing/request.method';
import SaveUserAction from './actions/settings/SaveUserAction';

@Controller
export default class SettingsController implements ControllerInterface {
    public get routes() {
        return {
            'saveUser': {
                method: RequestMethod.post,
                handler: SaveUserAction
            },
        };
    }
}