import { createStore, Module } from "vuex-smart-module";
import { authStore } from "@/store/modules/auth.store";
import { chatStore } from "./modules/chat.store";
import { requestStore } from "@/store/modules/request.store";

export const store = createStore(
  new Module({
    modules: {
      auth: authStore,
      chat: chatStore,
      request: requestStore,
    },
  })
);
