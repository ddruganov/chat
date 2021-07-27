<template>
  <h3 class="text-center mb-3">вход</h3>

  <form class="login-form" @submit.prevent="login()">
    <div class="input-wrapper mb-3" data-label="логин">
      <input type="text" class="input" v-model="email" />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>
    <div class="input-wrapper mb-3" data-label="пароль">
      <input type="text" class="input" v-model="password" />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>
    <button class="button" :disabled="requestPending">
      <div v-if="requestPending" class="spinner-border text-white spinner-border-sm" />
      <span v-else>войти</span>
    </button>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import Api from "@/common/api";
import { authStore } from "@/store/modules/auth.store";
import { Vue } from "vue-class-component";

export default class AuthLogin extends Vue {
  get isAuthenticated() {
    return authStore.context(this.$store).getters.isAuthenticated;
  }

  private requestPending: boolean = false;

  private email: string = "";
  private password: string = "";
  private errors: { [key: string]: string } = {};

  mounted() {
    this.load();
  }

  private load() {}

  private login() {
    this.requestPending = true;
    Api.auth
      .login(this.email, this.password)
      .then((response) => {
        if (!response.success) {
          this.errors = response.data.errors;
          return;
        }
      })
      .catch((e) => this.$notifications.error("Ошибка авторизации<br>" + e.message))
      .finally(() => {
        this.requestPending = false;
      });
  }
}
</script>
