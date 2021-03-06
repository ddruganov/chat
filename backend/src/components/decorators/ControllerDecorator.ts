import App from "../../service/app";
import ControllerInterface from "../routing/controller.interface";

export default function Controller(constructor: Function) {
    const baseRoute = constructor.name.split(/(?=[A-Z])/)[0].toLowerCase();

    const controller = new (<any>constructor)() as ControllerInterface;
    const routes = controller.routes;
    for (let routeName in routes) {
        const route = routes[routeName];
        App.instance.expressApp[route.method]('/' + baseRoute + '/' + routeName, route.handler);
    }
}