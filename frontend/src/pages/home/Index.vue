<template>
  <div class="chat-window my-5">
    <div v-if="currentRoomId && currentRoom" class="block">
      <div class="messages">
        <div
          class="message"
          v-for="message in currentRoom.messages"
          :key="message.id"
          :class="{ my: message.userId === authenticatedUser.id }"
        >
          {{ message.contents }}
        </div>
      </div>
      <form class="new-message" @submit.prevent="() => sendMessage()">
        <div class="input-wrapper" data-label="введите сообщение">
          <textarea class="input" v-model="message" @keypress="(e) => handleKeyPress(e)"></textarea>
        </div>
        <i class="send fas fa-paper-plane" @click="() => sendMessage()" />
      </form>
    </div>
    <div v-else class="no-room-selected text-muted">
      выберите чат из меню слева
    </div>
  </div>
</template>

<script lang="ts">
import { authStore } from "@/store/modules/auth.store";
import { messageStore, SEND_MESSAGE } from "@/store/modules/message.store";
import { Vue } from "vue-class-component";

export default class HomeIndex extends Vue {
  private message: string = "";

  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get currentRoom() {
    return messageStore.context(this.$store).state.rooms.find((r) => r.id === this.currentRoomId);
  }

  private sendMessage() {
    if (!this.message.length) {
      return;
    }

    messageStore.context(this.$store).dispatch(SEND_MESSAGE, { roomId: this.currentRoomId, contents: this.message });
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (e.key !== "Enter" || e.shiftKey) {
      return;
    }

    const target = e.target as HTMLInputElement;
    target.form?.dispatchEvent(new Event("submit", { cancelable: true }));
    e.preventDefault();
  }
}
</script>
