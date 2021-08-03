<template>
  <header class="topbar navbar navbar-expand-lg p-3">
    <i class="sidebar-toggler fas fa-bars" @click.prevent="() => toggleSidebar()" />
    <div v-if="currentRoom" class="open-room">
      <span class="name">{{ getCurrentRoomName() }}</span>
      <span class="user-count text-muted">({{ currentRoom.users.map((u) => u.name).join(", ") }})</span>
    </div>
  </header>
</template>

<style lang="scss"></style>

<script lang="ts">
import { authStore } from "@/store/modules/auth.store";
import { messageStore } from "@/store/modules/message.store";
import { Vue } from "vue-class-component";

export default class Topbar extends Vue {
  showSidebar = false;

  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }

  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }

  get currentRoom() {
    return messageStore.context(this.$store).state.rooms.find((r) => r.id === this.currentRoomId);
  }

  toggleSidebar() {
    this.$emit("toggleSidebar");
  }

  private getCurrentRoomName() {
    if (!this.currentRoom) {
      return undefined;
    }

    if (this.currentRoom.users.length > 2) {
      return this.currentRoom?.name;
    }

    return this.currentRoom.users.filter((u) => u.id !== this.authenticatedUser.id)[0].name;
  }
}
</script>
