<template>
  <div class="bg-white rounded-10 p-3 my-5">
    <h3 class="m-0">Домашняя страница</h3>
  </div>

  <div class="bg-white rounded-10 p-3">
    <div class="container">
      <div class="col-lg-6 offset-lg-3">
        <div v-if="ready">
          <p v-for="(user, i) in info" :key="i">{{ user.username }} {{ user.type }}</p>
        </div>

        <div v-if="!ready">
          <h4>Enter your username</h4>
          <form @submit.prevent="addUser()">
            <div class="form-group row">
              <input type="text" class="form-control col-9" v-model="username" placeholder="Enter username here" />
              <input type="submit" value="Join" class="btn btn-sm btn-info ml-1" />
            </div>
          </form>
        </div>
        <h2 v-else>{{ username }}</h2>
        <div class="card bg-info" v-if="ready">
          <div class="card-header text-white">
            <h4>
              My Chat App
              <span class="float-right">{{ connections }} connections</span>
            </h4>
          </div>
          <ul class="list-group list-group-flush text-right">
            <small v-if="typing" class="text-white">{{ typing }} is typing</small>
            <li class="list-group-item" v-for="(message, i) in messages" :key="i">
              <span :class="{ 'float-left': message.type === 1 }">
                {{ message.message }}
                <small>:{{ message.user }}</small>
              </span>
            </li>
          </ul>

          <div class="card-body">
            <form @submit.prevent="send()">
              <div class="form-group">
                <input type="text" class="form-control" v-model="newMessage" placeholder="Enter message here" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { io, Socket } from "socket.io-client";
import { Vue } from "vue-class-component";
// import { Watch } from "vue-property-decorator";

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
  private socket: Socket = io("http://localhost:80");

  private newMessage = "";
  private typing = false;
  private ready = false;
  private info: Info[] = [];
  private connections = 0;
  private messages: Message[] = [];
  private username = "";

  // @Watch("newMessage") onNewMessageChanged(newMessage: string, preNewMessage: any) {
  //   newMessage ? this.socket.emit("typing", this.username) : this.socket.emit("stopTyping");
  // }

  mounted() {
    window.onbeforeunload = () => {
      this.socket.emit("leave", this.username);
    };

    this.socket.on("chat-message", (data) => {
      this.messages.push({
        message: data.message,
        type: 1,
        user: data.user,
      });
    });

    this.socket.on("typing", (data) => {
      this.typing = data;
    });

    this.socket.on("stopTyping", () => {
      this.typing = false;
    });

    this.socket.on("joined", (data) => {
      this.info.push({
        username: data.name,
        type: "joined",
      });

      this.messages.push(...data.messages);

      setTimeout(() => {
        this.info.length = 0;
      }, 5000);
    });

    this.socket.on("leave", (data) => {
      this.info.push({
        username: data,
        type: "left",
      });

      setTimeout(() => {
        this.info.length = 0;
      }, 5000);
    });

    this.socket.on("connections", (data) => {
      this.connections = data;
    });
  }

  private send() {
    this.messages.push({
      message: this.newMessage,
      type: 0,
      user: "Me",
    });

    this.socket.emit("chat-message", {
      message: this.newMessage,
      user: this.username,
    });
    this.newMessage = "";
  }

  private addUser() {
    this.ready = true;
    console.log("add use disconn?", this.socket.disconnected);
    this.socket.emit("joined", this.username);
  }
}
</script>
