import router from "@/router";
import { store } from "@/store";
import { authStore } from "@/store/modules/auth.store";
import { ADD_ROOM, chatStore, CHAT_STORE_NAMESPACE, DELETE_ROOM, LOAD_ROOMS, RECEIVE_MESSAGE, SEND_MESSAGE, SET_ROOMS, START_CHAT } from "@/store/modules/chat.store";
import Room from "@/types/chat/Room";
import { io, Socket } from "socket.io-client";

export default class ChatSocket {

    private socket?: Socket = undefined;

    get authenticatedUser() {
        return authStore.context(store).getters.authenticatedUser;
    }

    get rooms() {
        return chatStore.context(store).state.rooms;
    }

    constructor() {
        store.subscribe((mutation) => {
            if (mutation.type === [CHAT_STORE_NAMESPACE, SET_ROOMS].join('/')) {
                this.socket?.disconnect();
                this.socket = io("http://localhost:3000");
                this.socket.emit('connection.handshake', {
                    userId: this.authenticatedUser.id
                });

                this.bootstrap();
            }

            if (mutation.type === [CHAT_STORE_NAMESPACE, START_CHAT].join('/')) {
                const eventName = 'room.create';
                this.socket?.emit(eventName, {
                    creatorId: this.authenticatedUser.id,
                    with: mutation.payload.with
                });
            }
        });

        store.subscribeAction((action) => {
            if (action.type === [CHAT_STORE_NAMESPACE, SEND_MESSAGE].join('/')) {
                const eventName = 'room.message.send';
                this.socket?.emit(eventName, action.payload);
            }

            if (action.type === [CHAT_STORE_NAMESPACE, DELETE_ROOM].join('/')) {
                const eventName = 'room.delete';
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

        this.rooms.forEach(room => this.bootstrapRoom(room));

        this.socket?.on(`user.${this.authenticatedUser.id}.invited`, (data: Room) => {
            chatStore.context(store).dispatch(LOAD_ROOMS)
                .then(success => {
                    if (!success || data.creatorId !== this.authenticatedUser.id) {
                        return;
                    }

                    router.push({ path: `/room/${data.id}` });
                });
        });
    }

    private bootstrapRoom(room: Room) {
        let eventName = `room.${room.id}.message.receive`;
        let listener = (data: any) => {
            chatStore.context(store).dispatch(RECEIVE_MESSAGE, data);
        };
        this.socket?.off(eventName, listener);
        this.socket?.on(eventName, listener);

        eventName = `room.${room.id}.deleted`;
        listener = () => {
            chatStore.context(store).dispatch(LOAD_ROOMS);
            if (Number(router.currentRoute.value.params.roomId) === room.id) {
                router.push({ path: '/' });
            }
        };
        this.socket?.off(eventName, listener);
        this.socket?.on(eventName, listener);
    }
}