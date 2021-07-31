import { store } from "@/store";
import { authStore } from "@/store/modules/auth.store";
import { LOAD_ROOMS, messageStore } from "@/store/modules/message.store";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("room.message", (data) => {
    // messageStore.context(store).dispatch()
    // // messages.push({
    // //     message: data.message,
    // //     type: 1,
    // //     user: data.user,
    // // });
});

socket.on('room.user.created', (data) => {
    if (data.userId !== authStore.context(store).getters.authenticatedUser.id) {
        return;
    }

    // update rooms
    messageStore.context(store).dispatch(LOAD_ROOMS);
});