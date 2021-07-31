<template>
  <router-view />
  <notifications />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Notifications from "./plugins/notifications/Notifications.vue";

@Options({
  components: { Notifications },
})
export default class App extends Vue {}
</script>
