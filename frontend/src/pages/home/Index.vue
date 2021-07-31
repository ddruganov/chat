<template>
  <div v-if="currentRoomId" class="block my-5">
    place messages here!
  </div>
  <div v-else class="text-muted h-100 d-flex align-items-center justify-content-center">
    выберите чат из меню слева
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class HomeIndex extends Vue {
  get currentRoomId() {
    return Number(this.$route.params.roomId);
  }
}
</script>
