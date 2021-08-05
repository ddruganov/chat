<template>
  <button class="go-back" @click="() => goBack()">
    <i class="icon fas fa-chevron-left" />
    <span class="caption">назад</span>
  </button>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class GoBack extends Vue {
  @Prop(String) readonly link!: string;

  private goBack() {
    this.$router.push({ path: this.link });
  }
}
</script>
