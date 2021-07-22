<template>
  <div class="root">
    <div class="container content d-flex align-items-center justify-content-center">
      <div class="login-wrapper rounded-10 p-5 bg-white">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  user-select: none;
  .content {
    flex: 1;
    .login-wrapper {
      width: 345px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class AuthLayout extends Vue {}
</script>
