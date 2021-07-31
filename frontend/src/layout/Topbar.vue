<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-dark p-3">
    <div class="text-white">{{ authenticatedUser.name }}</div>
  </header>
</template>

<style lang="scss"></style>

<script lang="ts">
import { authStore } from "@/store/modules/auth.store";
import { Vue } from "vue-class-component";

export default class Topbar extends Vue {
  get authenticatedUser() {
    return authStore.context(this.$store).getters.authenticatedUser;
  }
}
</script>
