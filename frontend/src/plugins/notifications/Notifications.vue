<template>
  <div id="notifications" />
</template>

<style lang="scss" scoped>
#notifications {
  position: absolute;
  width: fit-content;
  height: fit-content;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Notifications extends Vue {}
</script>
