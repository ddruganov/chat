import fs from 'fs';
import App from "./service/app";
import SocketService from "./service/socket.service";

const app = App.instance;
const socketService = SocketService.instance;
socketService.init();

const testFolder = __dirname + '/controllers';
fs.readdir(testFolder, (_, files) => {
    files.forEach(file => {
        /^.*\.controller\.ts$/.test(file) && new (require(testFolder + '/' + file)).default();
    });
});