<template>
  <transition name="fade-slide">
    <div v-show="isActive" :class="`notification ${type} rounded-10 p-3 mb-3`">
      <div class="close" role="button" @click="close()">
        <i class="fas fa-times" />
      </div>
      <div class="content">
        <div v-if="title" class="title h5" v-html="title" />
        <div class="body" v-html="message" />
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateX(calc(250px + 1rem));
}

.notification {
  width: 250px;
  height: fit-content;
  position: relative;
  color: white !important;
  opacity: 0.75;

  &:hover {
    opacity: 1;
  }

  &.success {
    background: #28a745 !important;
  }
  &.error {
    background: #dc3545 !important;
  }
  &.info {
    background: #17a2b8 !important;
  }
  &.warning {
    background: #ffc107 !important;
  }

  .close {
    position: absolute;
    left: -5px;
    top: -5px;
    width: 16px;
    height: 16px;
    background: white;
    color: black;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    border-bottom: 1px solid white;
    padding-bottom: 0.5rem;
    cursor: default;
  }
  .body {
    cursor: default;
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Notification extends Vue {
  @Prop(String) readonly title!: string;
  @Prop(String) readonly message!: string;
  @Prop(String) readonly type!: string;
  @Prop({ type: Number, required: false }) readonly timeout!: number;

  isActive = false;

  mounted() {
    this.isActive = true;
    this.timeout !== -1 && setTimeout(this.close, this.timeout);
  }

  close() {
    this.isActive = false;
    setTimeout(() => {
      this.$el.parentNode.remove();
    }, 250);
  }
}
</script>
