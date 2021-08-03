import Controller from "../components/decorators/ControllerDecorator";
import ControllerInterface from "../components/routing/controller.interface";
import RequestMethod from "../components/routing/request.method";
import LoginAction from "./actions/auth/LoginAction";
import LogoutAction from "./actions/auth/LogoutAction";
import GetCurrentUserAction from "./actions/auth/GetCurrentUserAction";

@Controller
export default class AuthController implements ControllerInterface {
    public get routes() {
        return {
            'login': {
                method: RequestMethod.post,
                handler: LoginAction
            },
            'logout': {
                method: RequestMethod.post,
                handler: LogoutAction
            },
            'getCurrentUser': {
                method: RequestMethod.post,
                handler: GetCurrentUserAction
            },
        };
    }
}