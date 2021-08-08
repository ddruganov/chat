<template>
  <div class="chat-window">
    <div v-if="currentRoom" class="block">
      <topbar />
      <div class="messages" :key="reloadMessages" ref="messageContainer">
        <div v-if="canLoadMoreMessages" class="load-more" ref="loadMoreContainer">
          <template v-if="loadingMoreMessages">
            <spinner />
            <span class="text-muted">Загружаю больше сообщений</span>
          </template>
          <template v-else>
            <button class="link" @click="() => loadMoreMessages()">Загрузить больше сообщений</button>
          </template>
        </div>
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
  </div>
</template>

<style lang="scss" scoped>
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin-bottom: 1rem;
  .spinner {
    margin-right: 1rem;
  }
}
</style>

<script lang="ts">
import Api from "@/common/api";
import FormInput from "@/components/FormInput.vue";
import Spinner from "@/components/Spinner.vue";
import Topbar from "@/layout/Topbar.vue";
import { authStore } from "@/store/modules/auth.store";
import {
  chatStore,
  CHAT_STORE_NAMESPACE,
  PREPEND_ROOM_MESSAGES,
  RELOAD_MESSAGES,
  SEND_MESSAGE,
} from "@/store/modules/chat.store";
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";

@Options({
  components: { FormInput, Topbar, Spinner },
})
export default class HomeIndex extends Vue {
  private message: string = "";
  private reloadMessages: number = 0;
  private page: number = 1;
  private loadingMoreMessages = false;
  private canLoadMoreMessages = true;

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

  get loadMoreContainer() {
    return this.$refs.loadMoreContainer as HTMLElement;
  }

  @Watch("currentRoom") onCurrentRoomChanged() {
    this.$nextTick(() => {
      this.scrollMessages();
    });
  }

  mounted() {
    this.$store.subscribeAction((action) => {
      if (action.type === [CHAT_STORE_NAMESPACE, RELOAD_MESSAGES].join("/")) {
        this.$nextTick(() => {
          this.scrollMessages(action.payload.scrollToBottom);
        });
      }
    });
  }

  private scrollMessages(scrollToBottom = true) {
    const prevScrollTop = this.messageContainer.scrollHeight / this.page - 32; // WTF???

    this.messageContainer.scrollTop =
      prevScrollTop === undefined || scrollToBottom ? this.messageContainer.scrollHeight : prevScrollTop;
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

  private loadMoreMessages() {
    if (!this.canLoadMoreMessages || this.loadingMoreMessages) {
      return;
    }

    this.loadingMoreMessages = true;
    Api.chat
      .loadRoomMessages(this.currentRoomId, this.page + 1)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }

        if (!response.data.length) {
          this.canLoadMoreMessages = false;
          return;
        }

        ++this.page;
        chatStore.context(this.$store).dispatch(PREPEND_ROOM_MESSAGES, {
          roomId: this.currentRoomId,
          messages: response.data,
        });
      })
      .catch((e) => this.$notifications.error(e.message))
      .finally(() => {
        this.loadingMoreMessages = false;
      });
  }
}
</script>
