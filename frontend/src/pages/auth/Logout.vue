<template>
  <span>Logging out...</span>
  <div class="spinner-border text-primary"></div>
</template>

<style lang="scss">
.spinner-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<script lang="ts">
import Api from "@/common/api";
import { authStore, SET_AUTHENTICATED } from "@/store/modules/auth.store";
import { Vue } from "vue-class-component";

export default class AuthLogout extends Vue {
  mounted() {
    Api.auth.logout().then((response) => {
      !response.success && this.$notifications.error("Ошибка выхода из аккаунта!");
      authStore.context(this.$store).dispatch(SET_AUTHENTICATED, !response.success);
      this.$router.push({ path: response.success ? "/auth/login" : "/" });
    });
  }
}
</script>
