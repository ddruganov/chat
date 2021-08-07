import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Application } from "express-serve-static-core";
import { createServer, Server } from 'http';
import httpConfig from "../config/http.config";

export default class App {
    private static _instance: App;
    public static get instance() {
        if (!App._instance) {
            App._instance = new App();
        }
        return App._instance;
    }

    private _expressApp: Application;
    public get expressApp() {
        return this._expressApp;
    }
    private _httpServer: Server;
    public get httpServer() {
        return this._httpServer;
    }

    constructor() {
        this._expressApp = express();
        this._expressApp.use(bodyParser.json())
        this._expressApp.use(cookieParser())
        this._expressApp.use(cors({
            allowedHeaders: ['Origin', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Origin', 'Accept-Encoding', 'X-Requested-With', 'Content-Type', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'X-Access-Token', 'X-Refresh-Token', 'Accept-Language', 'Cache-Control', 'Connection', 'Host', 'Pragma', 'Referer'],
            methods: ['GET', 'PUT', 'POST', 'DELETE'],
            origin: true,
            credentials: true
        }));

        this._httpServer = createServer(this._expressApp);
        this._httpServer.listen(httpConfig.port, () => {
            console.log("Server started on port", httpConfig.port);
        });
    }
}