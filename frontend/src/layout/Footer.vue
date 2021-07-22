<template>
  <footer class="footer bg-light border-top p-3">
    <span class="text-muted">{{ fullYear }} pAcc</span>
  </footer>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class FooterComponent extends Vue {
  get fullYear() {
    return new Date().getFullYear();
  }
}
</script>
