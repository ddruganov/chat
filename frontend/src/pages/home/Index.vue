<template>
  <div class="chat-window">
    <div v-if="currentRoomId && currentRoom" class="block">
      <div class="messages" :key="reloadMessages">
        <div
          class="message"
          v-for="message in currentRoom.messages"
          :key="message.id"
          :class="{ my: message.userId === authenticatedUser.id }"
        >
          <div class="contents">{{ message.contents }}</div>
          <div class="creation-date">{{ message.creationDate }}</div>
        </div>
      </div>
      <form class="new-message" @submit.prevent="() => sendMessage()">
        <form-input v-model="message" type="textarea" label="введите сообщение" />
        <!-- <div class="input-wrapper" data-label="введите сообщение">
          <textarea class="input" v-model="message" @keypress="(e) => handleKeyPress(e)"></textarea>
        </div> -->
        <i class="send fas fa-paper-plane" @click="() => sendMessage()" />
      </form>
    </div>
    <div v-else class="no-room-selected text-muted">
      выберите чат из меню слева
    </div>
  </div>
</template>

<script lang="ts">
import FormInput from "@/components/FormInput.vue";
import { authStore } from "@/store/modules/auth.store";
import { messageStore, SEND_MESSAGE } from "@/store/modules/message.store";
import { Options, Vue } from "vue-class-component";

@Options({
  components: { FormInput },
})
export default class HomeIndex extends Vue {
  private message: string = "";
  private reloadMessages: number = 0;

  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get currentRoom() {
    return messageStore.context(this.$store).state.rooms.find((r) => r.id === this.currentRoomId);
  }

  get messageContainer() {
    return document.querySelector(".messages")!;
  }

  mounted() {
    this.$store.subscribeAction((action) => {
      if (action.type === "message/reloadMessages") {
        this.scrollMessages();
      }
    });
  }

  private scrollMessages() {
    const scrollTop = Math.floor(this.messageContainer.scrollTop);
    const scrollHeight = Math.floor(
      this.messageContainer.scrollHeight - this.messageContainer.getBoundingClientRect().height
    );
    const prevScrollTop =
      Math.abs(scrollTop - scrollHeight) <= 1 ? undefined : Math.floor(this.messageContainer.scrollTop);

    ++this.reloadMessages;

    this.$nextTick(() => {
      this.messageContainer.scrollTo({
        top: prevScrollTop === undefined ? this.messageContainer.scrollHeight : prevScrollTop,
      });
    });
  }

  private sendMessage() {
    if (!this.message.length) {
      return;
    }

    messageStore.context(this.$store).dispatch(SEND_MESSAGE, {
      roomId: this.currentRoomId,
      userId: this.authenticatedUser.id,
      contents: this.message,
    });

    this.message = "";
  }
}
</script>
