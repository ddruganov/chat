<template>
  <h3 class="text-center mb-3">вход</h3>

  <form class="login-form" @submit.prevent="login()">
    <form-input v-model="email" label="логин" :error="errors.email" class="mb-3" />
    <form-input v-model="password" label="пароль" :error="errors.password" class="mb-3" />

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
import FormInput from "@/components/FormInput.vue";
import { authStore } from "@/store/modules/auth.store";
import { Options, Vue } from "vue-class-component";

@Options({
  components: { FormInput },
})
export default class AuthLogin extends Vue {
  get isAuthenticated() {
    return authStore.context(this.$store).getters.isAuthenticated;
  }

  private requestPending: boolean = false;

  private email: string = "ddruganov@bk.ru";
  private password: string = "passadmin";
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

        this.$router.push({ path: "/" });
      })
      .catch((e) => this.$notifications.error("Ошибка авторизации<br>" + e.message))
      .finally(() => {
        this.requestPending = false;
      });
  }
}
</script>
