<template>
  <div class="user-search">
    <form-input v-model="search" label="поиск" type="text" :inputEventDelay="500" @input="() => performSearch()" />
    <div class="results" :class="{ show: !!searchResult.length }">
      <div v-for="user in searchResult" :key="user.id" class="user" @click="() => startChat(user)">
        {{ user.name }} (@{{ user.nick }})
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Api from "@/common/api";
import { chatStore, START_CHAT } from "@/store/modules/chat.store";
import User from "@/types/auth/User";
import { Options, Vue } from "vue-class-component";
import FormInput from "./FormInput.vue";

@Options({
  components: { FormInput },
})
export default class UserSearch extends Vue {
  private search: string = "";
  private searchResult: User[] = [];

  private performSearch() {
    if (!this.search) {
      this.searchResult = [];
      return;
    }

    Api.user
      .search(this.search)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error);
        }

        this.searchResult = response.data;
      })
      .catch((e) => this.$notifications.error(e.message));
  }

  private startChat(user: User) {
    chatStore.context(this.$store).dispatch(START_CHAT, {
      with: user.id!,
    });
    this.clear();
  }

  private clear() {
    this.search = "";
    this.searchResult = [];
  }
}
</script>
