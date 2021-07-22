<template>
  <div class="d-flex align-items-center">
    <transition name="fade" mode="out-in">
      <div v-if="count > 0">
        <div class="spinner-border spinner-border-sm text-primary" />
        <span class="text-muted ms-1">сохранение</span>
      </div>
      <div v-else-if="done">
        <template v-if="success">
          <i class="fas fa-check text-success" />
          <span class="text-muted ms-1">сохранено</span>
        </template>
        <template v-else>
          <i class="fas fa-times text-danger" />
          <span class="text-muted ms-1">ошибка</span>
        </template>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

export default class SaveIndicator extends Vue {
  @Prop(Number) readonly count!: number;
  @Prop(Boolean) readonly success!: boolean;

  @Watch("count") onDecrementChanged() {
    this.done = !this.count;

    if (!this.done) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.done = false;
    }, 1000);
  }
  timer = 0;
  done = false;
}
</script>
