<template>
  <div class="chat-window">
    <div v-if="currentRoom" class="block">
      <topbar />
      <div class="messages" :key="reloadMessages" ref="messageContainer">
        <template v-if="currentRoom.messages.length">
          <div
            class="message"
            v-for="message in currentRoom.messages"
            :key="message.id"
            :class="{ my: message.userId === authenticatedUser.id }"
          >
            <div class="contents">{{ message.contents }}</div>
            <div class="creation-date">{{ message.creationDate }}</div>
          </div>
        </template>
        <span v-else class="text-muted m-auto">у вас пока нет сообщений</span>
      </div>
      <form class="new-message" @submit.prevent="() => sendMessage()">
        <form-input v-model="message" type="textarea" label="введите сообщение" />
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
import Topbar from "@/layout/Topbar.vue";
import { authStore } from "@/store/modules/auth.store";
import { chatStore, CHAT_STORE_NAMESPACE, RELOAD_MESSAGES, SEND_MESSAGE } from "@/store/modules/chat.store";
import { Options, Vue } from "vue-class-component";

@Options({
  components: { FormInput, Topbar },
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
    return chatStore.context(this.$store).state.rooms.find((r) => r.id === this.currentRoomId);
  }

  get messageContainer() {
    return this.$refs.messageContainer as HTMLElement;
  }

  mounted() {
    this.$store.subscribeAction((action) => {
      if (action.type === [CHAT_STORE_NAMESPACE, RELOAD_MESSAGES].join("/")) {
        this.scrollMessages(action.payload);
      }
    });
  }

  private scrollMessages(options: { scrollToBottom: boolean }) {
    const scrollTop = Math.floor(this.messageContainer.scrollTop);
    const scrollHeight = Math.floor(
      this.messageContainer.scrollHeight - this.messageContainer.getBoundingClientRect().height
    );
    const prevScrollTop = Math.abs(scrollTop - scrollHeight) <= 1 ? undefined : scrollTop;

    this.$nextTick(() => {
      this.messageContainer.scrollTop =
        prevScrollTop === undefined || options.scrollToBottom ? this.messageContainer.scrollHeight : prevScrollTop;
    });
  }

  private sendMessage() {
    if (!this.message.length) {
      return;
    }

    chatStore.context(this.$store).dispatch(SEND_MESSAGE, {
      roomId: this.currentRoomId,
      userId: this.authenticatedUser.id,
      contents: this.message,
    });

    this.message = "";
  }
}
</script>
