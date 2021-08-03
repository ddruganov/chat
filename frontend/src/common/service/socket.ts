import { store } from "@/store";
import { authStore } from "@/store/modules/auth.store";
import { messageStore, RECEIVE_MESSAGE } from "@/store/modules/message.store";
import { io, Socket } from "socket.io-client";

export default class ChatSocket {

    private socket?: Socket = undefined;

    get authenticatedUser() {
        return authStore.context(store).getters.authenticatedUser;
    }

    get rooms() {
        return messageStore.context(store).state.rooms;
    }

    constructor() {
        store.subscribe((mutation) => {
            if (mutation.type === 'message/setRooms') {
                this.socket?.disconnect();
                this.socket = io("http://localhost:3000");
                this.socket.emit('connection.handshake', {
                    userId: this.authenticatedUser.id
                });

                this.bootstrap();
            }
        });

        store.subscribeAction((action) => {
            if (action.type === 'message/sendMessage') {
                const eventName = 'room.message.send';
                this.socket?.emit(eventName, action.payload);
            }
        });
    }

    private bootstrap() {
        const disconnect = () => {
            this.socket?.emit('connection.close', { userId: this.authenticatedUser.id });
        };
        window.removeEventListener('beforeunload', disconnect);
        window.addEventListener('beforeunload', disconnect);

        this.rooms.forEach(room => {
            const eventName = `room.${room.id}.message.receive`;
            const listener = (data: any) => {
                messageStore.context(store).dispatch(RECEIVE_MESSAGE, data);
            };
            this.socket?.off(eventName, listener);
            this.socket?.on(eventName, listener);
        });
    }
}