<template>
  <header class="topbar">
    <div v-if="currentRoom" class="open-room">
      <go-back link="/" />
      <span class="name">{{ currentRoomName }}</span>
      <span class="user-count link" modal-trigger="showRoomUsers">{{ currentRoomUserCount }}</span>

      <modal-window id="showRoomUsers" hideFooter>
        <template #title>Пользователи</template>
        <template #body>
          <div v-for="(user, i) in currentRoom.users" :key="user.id">{{ i + 1 }}. {{ user.name }}</div>
        </template>
      </modal-window>
    </div>
  </header>
</template>

<script lang="ts">
import { authStore } from "@/store/modules/auth.store";
import { chatStore } from "@/store/modules/chat.store";
import { Options, Vue } from "vue-class-component";
import RoomDataHelper from "@/common/helpers/RoomDataHelper";
import ModalWindow from "@/components/ModalWindow.vue";
import GoBack from "@/components/GoBack.vue";

@Options({
  components: { ModalWindow, GoBack },
})
export default class Topbar extends Vue {
  showSidebar = false;

  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get currentRoom() {
    return chatStore.context(this.$store).state.rooms.find((r) => r.id === this.currentRoomId)!;
  }

  get currentRoomName() {
    return RoomDataHelper.getName(this.currentRoom, this.authenticatedUser);
  }

  get currentRoomUserCount() {
    return RoomDataHelper.getUserCount(this.currentRoom);
  }
}
</script>
