<template>
  <h3 class="text-center">Вход</h3>

  <a v-if="vkLoginLink" :href="vkLoginLink" class="btn btn-sm btn-primary lh-normal w-100">Войти через VK</a>
</template>

<script lang="ts">
import Api from "@/common/api";
import { authStore } from "@/store/modules/auth.store";
import { Vue } from "vue-class-component";

export default class AuthLogin extends Vue {
  get isAuthenticated() {
    return authStore.context(this.$store).getters.isAuthenticated;
  }

  private vkLoginLink: string = "";

  mounted() {
    this.load();
  }

  private load() {
    Api.auth
      .getVkLoginLink()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }
        this.vkLoginLink = response.data.link;
      })
      .catch((e) => this.$notifications.error(e.message));
  }
}
</script>
