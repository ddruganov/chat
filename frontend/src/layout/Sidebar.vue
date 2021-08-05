<template>
  <div class="sidebar">
    <div class="header">
      <h3 class="username link" modal-trigger="settings-modal">{{ authenticatedUser.name }}</h3>
    </div>
    <user-search />
    <div class="rooms">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="room"
        :class="{ active: room.id === currentRoomId }"
        @click="() => openRoom(room.id)"
      >
        <div class="header">
          <div class="name">
            {{ getRoomName(room) }}
          </div>
          <i class="delete-chat fas fa-trash" @click.prevent="() => deleteRoom(room.id)" />
        </div>
        <div class="last-message text-muted">
          {{ getLastMessage(room) }}
        </div>
      </div>
    </div>

    <modal-window id="settings-modal">
      <template #title>
        <div class="d-flex align-items-center">
          <span>Настройки</span>
          <save-indicator class="ms-3" :count="saveCount" :success="saveSuccess" />
        </div>
      </template>
      <template #body>
        <form-input class="mb-3" type="text" label="имя" v-model="authenticatedUser.name" @change="() => saveUser()" />
        <form-input type="text" label="псевдоним" v-model="authenticatedUser.nick" @change="() => saveUser()" />
      </template>
      <template #footer>
        <button class="button w-fit-content" @click="() => logout()">выйти</button>
      </template>
    </modal-window>
  </div>
</template>

<script lang="ts">
import Api from "@/common/api";
import FormInput from "@/components/FormInput.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import SaveIndicator from "@/components/SaveIndicator.vue";
import UserSearch from "@/components/UserSearch.vue";
import { authStore, GET_CURRENT_USER } from "@/store/modules/auth.store";
import { LOAD_ROOMS, chatStore, RELOAD_MESSAGES } from "@/store/modules/chat.store";
import Room from "@/types/chat/Room";
import { Options, Vue } from "vue-class-component";

@Options({
  components: { ModalWindow, SaveIndicator, FormInput, UserSearch },
})
export default class Sidebar extends Vue {
  private saveCount: number = 0;
  private saveSuccess: boolean = false;
  private search: string = "";

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }

  get rooms() {
    return chatStore
      .context(this.$store)
      .state.rooms.filter((room) => room.messages.length || room.creatorId === this.authenticatedUser.id);
  }

  mounted() {
    chatStore.context(this.$store).dispatch(LOAD_ROOMS);
  }

  private openRoom(roomId: number) {
    this.$router.push({ path: `/room/${roomId}` }).then(() => {
      chatStore.context(this.$store).dispatch(RELOAD_MESSAGES, { scrollToBottom: true });
    });
  }

  private saveUser() {
    ++this.saveCount;
    Api.settings
      .saveUser(this.authenticatedUser)
      .then((response) => {
        this.saveSuccess = response.success;

        if (!response.success) {
          throw new Error(response.error);
        }

        authStore.context(this.$store).dispatch(GET_CURRENT_USER);
      })
      .catch((e: Error) => this.$notifications.error(e.message))
      .finally(() => {
        --this.saveCount;
      });
  }

  private getLastMessage(room: Room) {
    if (!room.messages.length) {
      return "Нет сообщений";
    }

    return room.messages[room.messages.length - 1].contents.slice(0, 15);
  }

  private getRoomName(room: Room) {
    if (room.users.length > 2) {
      return room.name;
    }

    return room.users.filter((u) => u.id !== this.authenticatedUser?.id)[0].name;
  }

  private logout() {
    Api.auth
      .logout()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }

        window.location.href = "/";
      })
      .catch((e) => this.$notifications.error(e.message));
  }

  private deleteRoom(id: number) {
    Api.chat
      .deleteRoom(id)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }

        chatStore.context(this.$store).dispatch(LOAD_ROOMS);
      })
      .catch((e) => this.$notifications.error(e.message));
  }
}
</script>
