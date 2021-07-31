import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import Message from "@/types/message/Message";
import Api from "@/common/api";
import Room from "@/types/message/Room";

// State
class MessageState {
  rooms: Room[] = [];
  messages: Message[] = [];
}

// Getters
class MessageGetters extends Getters<MessageState> {
}

// Actions
export const LOAD_ROOMS = 'loadRooms';
export const RECEIVE_MESSAGE = "receiveMessage";
class MessageActions extends Actions<MessageState, MessageGetters, MessageMutations, MessageActions> {
  [LOAD_ROOMS]() {
    Api.message.loadRooms().then((response) => {
      if (!response.success) {
        throw new Error(response.error);
      }

      this.state.rooms = response.data;

    })
      .catch((e: Error) => console.log(e.message));
  }

  [RECEIVE_MESSAGE](payload: Message): void {
    this.commit(RECEIVE_MESSAGE, payload);
  }
}

// Mutations
class MessageMutations extends Mutations<MessageState> {
  [RECEIVE_MESSAGE](payload: Message) {
    this.state.messages.push(payload);
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
