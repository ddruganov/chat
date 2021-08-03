<template>
  <div class="sidebar">
    <div class="header">
      <h3 class="username">{{ authenticatedUser.name }}</h3>
      <div class="controls">
        <i class="settings fas fa-sliders-h" modal-trigger="settings-modal" />
      </div>
    </div>
    <div class="rooms d-flex flex-column">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="room"
        :class="{ active: room.id === currentRoomId }"
        @click="() => openRoom(room.id)"
      >
        <div class="name">
          {{ room.name }}
        </div>
        <div class="last-message text-muted">
          {{ getLastMessage(room) }}
        </div>
      </div>
    </div>

    <modal-window id="settings-modal" hide-footer>
      <template #title>
        <div class="d-flex align-items-center">
          <span>Настройки</span>
          <save-indicator class="ms-3" :count="saveCount" :success="saveSuccess" />
        </div>
      </template>
      <template #body>
        <div class="input-wrapper" data-label="имя">
          <input class="input" type="text" v-model="authenticatedUser.name" @change="() => saveUser()" />
        </div>
      </template>
    </modal-window>
  </div>
</template>

<script lang="ts">
import Api from "@/common/api";
import ModalWindow from "@/components/ModalWindow.vue";
import SaveIndicator from "@/components/SaveIndicator.vue";
import { authStore, GET_CURRENT_USER } from "@/store/modules/auth.store";
import { LOAD_ROOMS, messageStore } from "@/store/modules/message.store";
import Room from "@/types/message/Room";
import { Options, Vue } from "vue-class-component";

@Options({
  components: { ModalWindow, SaveIndicator },
})
export default class Sidebar extends Vue {
  private saveCount: number = 0;
  private saveSuccess: boolean = false;

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }

  get rooms() {
    return messageStore.context(this.$store).state.rooms;
  }

  mounted() {
    messageStore.context(this.$store).dispatch(LOAD_ROOMS);
  }

  private openRoom(roomId: number) {
    // this.$emit("toggleSidebar");
    this.$router.push({ path: `/room/${roomId}` });
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
}
</script>
