import Controller from "../components/decorators/ControllerDecorator";
import ControllerInterface from "../components/routing/controller.interface";
import RequestMethod from "../components/routing/request.method";
import SearchAction from "./actions/user/SearchAction";

@Controller
export default class UserController implements ControllerInterface {
    public get routes() {
        return {
            'search': {
                method: RequestMethod.post,
                handler: SearchAction
            },
        };
    }
}