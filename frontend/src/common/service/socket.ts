import { store } from "@/store";
import { authStore } from "@/store/modules/auth.store";
import { io, Socket } from "socket.io-client";

export default class ChatSocket {

    private socket?: Socket = undefined;

    get authenticatedUser() {
        return authStore.context(store).getters.authenticatedUser;
    }

    constructor() {
        this.init();
    }

    private init() {
        store.subscribe((mutation) => {
            if (mutation.type !== 'auth/setUser') {
                return;
            }

            this.socket = io("http://localhost:3000");
            this.socket.emit('connection.handshake', {
                userId: this.authenticatedUser.id
            });
        });

        window.addEventListener('beforeunload', () => {
            this.socket?.emit('connection.close', { userId: this.authenticatedUser.id });
        });

        // this.socket.on("room.message", (data) => {
        //     // messageStore.context(store).dispatch()
        //     // // messages.push({
        //     // //     message: data.message,
        //     // //     type: 1,
        //     // //     user: data.user,
        //     // // });
        // });

        // this.socket.on('room.user.created', (data) => {
        //     if (data.userId !== authStore.context(store).getters.authenticatedUser.id) {
        //         return;
        //     }

        //     // update rooms
        //     messageStore.context(store).dispatch(LOAD_ROOMS);
        // });
    }

}