<template>
  <div v-if="dataLoaded" class="d-flex flex-column">
    <topbar />
    <div class="basic-layout d-flex">
      <div class="content-container d-flex flex-column w-100">
        <div class="content container p-0">
          <router-view />
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.basic-layout {
  min-height: calc(100vh - 71px);
  width: 100%;
  .content-container {
    flex: 1;
    .content {
      flex: 1;
    }
  }
}
</style>

<script lang="ts">
import Topbar from "./Topbar.vue";
import Footer from "./Footer.vue";

import { Options, Vue } from "vue-class-component";

// import { authStore, GET_CURRENT_USER } from "@/store/modules/auth.store";

@Options({
  components: { Topbar, Footer },
})
export default class MainLayout extends Vue {
  dataLoaded = true;

  mounted() {
    this.load();
  }
  load() {
    // authStore
    //   .context(this.$store)
    //   .dispatch(GET_CURRENT_USER)
    //   .then(() => {
    //     this.dataLoaded = true;
    //   });
  }
}
</script>
