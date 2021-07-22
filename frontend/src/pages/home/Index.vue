<template>
  <div class="bg-white rounded-10 p-3 my-5">
    <h3 class="m-0">Домашняя страница</h3>
  </div>

  <div class="bg-white rounded-10 p-3">
    <div class="d-flex align-items-center w-100">
      <textarea class="" v-model="messageContent"></textarea>
      <button @click="sendMessage()" class="btn btn-primary btn-sm lh-normal">Отправить</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import Action from "@/types/chat/Action";
import User from "@/types/auth/User";
import Message from "@/types/chat/Message";
import { SocketService } from "@/common/service/socketService";
import { Event } from "@/types/chat/Event";

export default class HomeIndex extends Vue {
  private action: Action = Action.JOINED;
  private user: User = {};
  private messages: Message[] = [];
  private messageContent: string | null = "";
  private socketService?: SocketService;
  private ioConnection: any;

  public mounted() {
    this.socketService = new SocketService();
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.ioConnection = this.socketService?.onMessage().subscribe((message: Message) => {
      this.messages.push(message);
    });

    this.socketService?.onEvent(Event.CONNECT).subscribe(() => {
      console.log("connected");
    });

    this.socketService?.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log("disconnected");
    });
  }

  public sendMessage(): void {
    if (!this.messageContent) {
      return;
    }

    this.socketService?.send({
      from: this.user,
      content: this.messageContent,
    });
    this.messageContent = null;
  }

  // public sendNotification(params: any, action: Action): void {
  //   const message = new Message();

  //   switch (action) {
  //     case Action.JOINED:
  //       message = new Message(); {
  //         from: this.user,
  //         action: action,
  //       };
  //       break;
  //     case Action.LEFT:
  //       break;
  //     case Action.RENAME:
  //       message = {
  //         action: action,
  //         content: {
  //           username: this.user.name,
  //           previousUsername: params.previousUsername,
  //         },
  //       };
  //       break;
  //   }

  //   this.socketService.send(message);
  // }
}
</script>
