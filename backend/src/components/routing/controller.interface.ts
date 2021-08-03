import { RequestHandler } from "express";
import RequestMethod from "./request.method";

export default interface ControllerInterface {
    routes: {
        [key: string]: {
            method: RequestMethod,
            handler: RequestHandler
        }
    }
}