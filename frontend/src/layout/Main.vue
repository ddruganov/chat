<template>
  <div v-if="dataLoaded" class="layout-main">
    <div class="basic-layout" @click="tryCloseSidebar">
      <transition name="slide">
        <sidebar v-show="showSidebar" @toggleSidebar="() => toggleSidebar()" />
      </transition>
      <!-- <div class="content-container" @click="(e) => tryHideSidebar(e)"> -->
      <div class="content-container">
        <div class="content">
          <topbar @toggleSidebar="() => toggleSidebar()" />
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.125s linear;
}
.slide-enter-active {
  animation: slide-in 0.125s;
}
.slide-leave-active {
  animation: slide-in 0.125s reverse;
}
@keyframes slide-in {
  0% {
    transform: translateX(-250px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>

<script lang="ts">
import Topbar from "./Topbar.vue";
import Footer from "./Footer.vue";
import Sidebar from "./Sidebar.vue";

import { Options, Vue } from "vue-class-component";

import { authStore, GET_CURRENT_USER } from "@/store/modules/auth.store";

@Options({
  components: { Topbar, Footer, Sidebar },
})
export default class MainLayout extends Vue {
  dataLoaded = false;
  showSidebar = true;

  mounted() {
    this.load();
  }

  load() {
    authStore
      .context(this.$store)
      .dispatch(GET_CURRENT_USER)
      .then(() => {
        this.dataLoaded = true;
      });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  tryHideSidebar(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (target.classList.contains("sidebar-toggler")) {
      return;
    }

    this.showSidebar && this.toggleSidebar();
  }
}
</script>
