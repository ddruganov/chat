<template>
  <div :class="{ loading: requestsPending }">
    <router-view />
    <div class="loader">
      <div class="spinner">
        <div class="spinner-border text-primary"></div>
      </div>
    </div>
    <notifications />
  </div>
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  background: #eee;
  position: relative;
  .loader {
    z-index: 9999 !important;
    display: none;
    position: fixed;
    background-color: rgba(255, 255, 255, 0.75);
    width: 100%;
    height: 100%;
    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &.loading {
    pointer-events: none;
    user-select: none;
    .loader {
      display: flex;
    }
  }
  .rounded-10 {
    border-radius: 10px !important;
  }
  .w-fit-content {
    width: fit-content !important;
  }
  .h-fit-content {
    height: fit-content !important;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Notifications from "./plugins/notifications/Notifications.vue";
import { requestStore } from "./store/modules/request.store";

@Options({
  components: { Notifications },
})
export default class App extends Vue {
  get requestsPending() {
    return requestStore.context(this.$store).getters.requestsPending;
  }
}
</script>
