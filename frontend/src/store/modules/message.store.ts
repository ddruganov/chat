import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import Message from "@/types/message/Message";
import Api from "@/common/api";
import Room from "@/types/message/Room";
import { store } from "..";

// State
class MessageState {
  rooms: Room[] = [];
}

// Getters
class MessageGetters extends Getters<MessageState> {
}

// Actions
export const LOAD_ROOMS = 'loadRooms';
export const LOAD_ROOM_MESSAGES = 'loadRoomMessage';
export const SEND_MESSAGE = "sendMessage";
export const RECEIVE_MESSAGE = "receiveMessage";
export const ADD_MESSAGE = "addMessage";
export const RELOAD_MESSAGES = "reloadMessages";
class MessageActions extends Actions<MessageState, MessageGetters, MessageMutations, MessageActions> {
  [LOAD_ROOMS]() {
    return Api.message.loadRooms().then((response) => {
      if (!response.success) {
        throw new Error(response.error);
      }

      this.commit(SET_ROOMS, response.data);
    })
      .catch((e: Error) => console.log(e.message));
  }
  [LOAD_ROOM_MESSAGES](id: number) {
    const room = this.state.rooms.find(r => r.id === id)!;
    if (room.messages.length) {
      return;
    }

    Api.message.loadRoomMessages(id).then((response) => {
      if (!response.success) {
        throw new Error(response.error);
      }

      room.messages = response.data;
    })
      .catch((e: Error) => console.log(e.message));
  }

  [SEND_MESSAGE](payload: any) {
    // used by socket to track outgoing messages
    return undefined;
  }

  [RELOAD_MESSAGES](payload: { scrollToBottom: boolean }) {
    // used by chat window to track changes in messages
    return undefined;
  }

  [RECEIVE_MESSAGE](payload: Message) {
    this.commit(ADD_MESSAGE, payload);
  }
}

// Mutations
export const SET_ROOMS = 'setRooms';
class MessageMutations extends Mutations<MessageState> {
  [SET_ROOMS](payload: Room[]) {
    this.state.rooms = payload;
  }

  [ADD_MESSAGE](payload: Message) {
    const room = this.state.rooms.find(r => r.id === payload.roomId);
    if (!room) {
      return;
    }

    room.messages.push(payload);
    messageStore.context(store).dispatch(RELOAD_MESSAGES, { scrollToBottom: false });
  }
}

// Create a module with module asset classes
export const messageStore = new Module({
  namespaced: true,
  state: MessageState,
  getters: MessageGetters,
  actions: MessageActions,
  mutations: MessageMutations,
});
