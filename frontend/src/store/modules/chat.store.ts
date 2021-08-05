import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import Message from "@/types/chat/Message";
import Api from "@/common/api";
import Room from "@/types/chat/Room";
import { store } from "..";
import StartChatConfig from "@/types/chat/StartChatConfig";
import router from "@/router";

// State
class ChatState {
  rooms: Room[] = [];
}

// Getters
class ChatGetters extends Getters<ChatState> {
}

// Actions
export const LOAD_ROOMS = 'loadRooms';
export const ADD_ROOM = 'addRoom';
export const LOAD_ROOM_MESSAGES = 'loadRoomMessage';
export const SEND_MESSAGE = "sendMessage";
export const RECEIVE_MESSAGE = "receiveMessage";
export const ADD_MESSAGE = "addMessage";
export const RELOAD_MESSAGES = "reloadMessages";
export const START_CHAT = 'startChat';
class ChatActions extends Actions<ChatState, ChatGetters, ChatMutations, ChatActions> {
  [LOAD_ROOMS]() {
    return new Promise(resolve => {
      Api.chat.loadRooms().then((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }

        this.commit(SET_ROOMS, response.data);
        resolve(true);
      })
        .catch((e: Error) => {
          console.log(e.message)
          resolve(false);
        });
    });
  }
  [ADD_ROOM](payload: Room) {
    this.commit(ADD_ROOM, payload);
  }
  [LOAD_ROOM_MESSAGES](id: number) {
    const room = this.state.rooms.find(r => r.id === id)!;
    if (room.messages.length) {
      return;
    }

    Api.chat.loadRoomMessages(id).then((response) => {
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

  [START_CHAT](payload: StartChatConfig) {
    const foundRoom = this.state.rooms.find(r => r.users.length === 2 && r.users.find(u => u.id === payload.with));
    if (foundRoom) {
      router.push({ path: `/room/${foundRoom.id}` });
      return
    }
    this.commit(START_CHAT, payload);
  }
}

// Mutations
export const SET_ROOMS = 'setRooms';
class ChatMutations extends Mutations<ChatState> {
  [SET_ROOMS](payload: Room[]) {
    this.state.rooms = payload;
  }

  [ADD_ROOM](payload: Room) {
    this.state.rooms.push(payload);
  }

  [ADD_MESSAGE](payload: Message) {
    const room = this.state.rooms.find(r => r.id === payload.roomId);
    // if we receive a message from a stranger and dont yet have the room listed then we load all rooms again
    if (!room) {
      chatStore.context(store).dispatch(LOAD_ROOMS);
      return;
    }

    room.messages.push(payload);
    chatStore.context(store).dispatch(RELOAD_MESSAGES, { scrollToBottom: false });
  }

  [START_CHAT](payload: StartChatConfig) {
    // used by socket to track new chats
    return undefined;
  }
}

// Create a module with module asset classes
export const CHAT_STORE_NAMESPACE = 'chat';
export const chatStore = new Module({
  namespaced: true,
  state: ChatState,
  getters: ChatGetters,
  actions: ChatActions,
  mutations: ChatMutations,
});
