import { App, render, h } from "vue";
import Notification from "./Notification.vue";
import NotificationOptions from "./types/NotificationOptions.interface";
import NotificationsModule from "./types/NotificationsModule.interface";

export default {
  install: (app: App) => {
    const notificationsModule: NotificationsModule = {
      show(message: string, title?: string, options: NotificationOptions = {}) {
        const parent = document.getElementById("notifications")!;
        const container = document.createElement("div");
        parent.appendChild(container);

        if (options.timeout === undefined) {
          options.timeout = 3000;
        }

        const vNode = h(Notification, { message, title, ...options });
        if (app && app._context) {
          vNode.appContext = app._context;
        }

        render(vNode, container);
      },
      success(message: string, title?: string, options: NotificationOptions = {}) {
        options.type = "success";
        this.show(message, title, options);
      },
      error(message: string, title?: string, options: NotificationOptions = {}) {
        options.type = "error";
        this.show(message, title, options);
      },
      info(message: string, title?: string, options: NotificationOptions = {}) {
        options.type = "info";
        this.show(message, title, options);
      },
      warning(message: string, title?: string, options: NotificationOptions = {}) {
        options.type = "warning";
        this.show(message, title, options);
      },
    };

    app.config.globalProperties.$notifications = notificationsModule;
  },
};

declare module "@vue/runtime-core" {
  //Bind to `this` keyword
  interface ComponentCustomProperties {
    $notifications: NotificationsModule;
  }
}
