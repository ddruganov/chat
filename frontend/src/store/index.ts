import { createStore, Module } from "vuex-smart-module";
import { authStore } from "@/store/modules/auth.store";
import { messageStore } from "./modules/message.store";
import { requestStore } from "@/store/modules/request.store";

export const store = createStore(
  new Module({
    modules: {
      auth: authStore,
      message: messageStore,
      request: requestStore,
    },
  })
);
