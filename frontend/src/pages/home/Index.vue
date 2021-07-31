<template>
  <div class="bg-white rounded-10 p-3 my-5">
    <h3 class="m-0">Домашняя страница</h3>
  </div>

  <div class="bg-white rounded-10 p-3 rooms">
    currently open: {{ currentRoomId }}
    <div v-for="room in rooms" :key="room.id" class="room rounded-10" @click="() => openRoom(room.id)">
      {{ room.name }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rooms {
  display: flex;
  flex-direction: column;
  .room {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    cursor: pointer;
    * {
      cursor: pointer;
    }
    &:hover {
      background: #eee;
    }
  }
}
</style>

<script lang="ts">
import { LOAD_ROOMS, messageStore } from "@/store/modules/message.store";
import { io, Socket } from "socket.io-client";
import { Vue } from "vue-class-component";

type Message = {
  message: string;
  type: number;
  user: any;
};
type Info = {
  username: string;
  type: string;
};

export default class HomeIndex extends Vue {
  private socket: Socket = io("http://localhost:3000");

  private newMessage = "";
  private typing = false;
  private ready = false;
  private info: Info[] = [];
  private connections = 0;
  private messages: Message[] = [];
  private username = "";

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get rooms() {
    return messageStore.context(this.$store).state.rooms;
  }

  mounted() {
    messageStore.context(this.$store).dispatch(LOAD_ROOMS);
  }

  private openRoom(roomId: number) {
    this.$router.push({ path: `/room/${roomId}` });
  }

  // mounted() {
  //   window.onbeforeunload = () => {
  //     this.socket.emit("leave", this.username);
  //   };

  //   this.socket.on("chat-message", (data) => {
  //     this.messages.push({
  //       message: data.message,
  //       type: 1,
  //       user: data.user,
  //     });
  //   });

  //   this.socket.on("typing", (data) => {
  //     this.typing = data;
  //   });

  //   this.socket.on("stopTyping", () => {
  //     this.typing = false;
  //   });

  //   this.socket.on("joined", (data) => {
  //     this.info.push({
  //       username: data.name,
  //       type: "joined",
  //     });

  //     this.messages.push(...data.messages);

  //     setTimeout(() => {
  //       this.info.length = 0;
  //     }, 5000);
  //   });

  //   this.socket.on("leave", (data) => {
  //     this.info.push({
  //       username: data,
  //       type: "left",
  //     });

  //     setTimeout(() => {
  //       this.info.length = 0;
  //     }, 5000);
  //   });

  //   this.socket.on("connections", (data) => {
  //     this.connections = data;
  //   });
  // }

  // private send() {
  //   this.messages.push({
  //     message: this.newMessage,
  //     type: 0,
  //     user: "Me",
  //   });

  //   this.socket.emit("chat-message", {
  //     message: this.newMessage,
  //     user: this.username,
  //   });
  //   this.newMessage = "";
  // }

  // private addUser() {
  //   this.ready = true;
  //   this.socket.emit("joined", this.username);
  // }
}
</script>
