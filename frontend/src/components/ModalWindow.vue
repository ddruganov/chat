<template>
  <transition name="fade">
    <div v-if="show" :id="id" @click="closeModal" class="mw" :class="{ show: show }">
      <div class="backdrop" :class="{ [modalClass]: modalClass }">
        <div class="content-wrapper">
          <div v-if="!hideHeader" class="header">
            <div class="header-wrapper">
              <slot name="title" />
              <i class="close-icon fas fa-times" @click="closeModal" />
            </div>
          </div>
          <div class="body">
            <slot name="body" />
          </div>
          <div v-if="!hideFooter" class="footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.125s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

export default class ModalWindow extends Vue {
  show = false;
  @Prop(Boolean) readonly hideFooter!: boolean;
  @Prop(Boolean) readonly hideHeader!: boolean;
  @Prop(String) readonly modalClass = String("modal_" + Date.now());
  @Prop(String) readonly id!: string;
  @Prop(Number) readonly reload!: number;
  @Watch("reload") onReload() {
    this.load();
  }

  mounted() {
    this.load();

    const body = document.querySelector("body")!;
    const app = body.querySelector("#app")!;
    body.insertBefore(this.$el, app);
  }

  unmounted() {
    document.querySelector("body")!.removeChild(this.$el);
  }

  load() {
    const trigger = document.querySelector(`[modal-trigger="${this.id}"]`);
    if (!trigger) {
      throw new Error(`Modal trigger for ${this.id} was not found`);
    }
    trigger.addEventListener("click", this.showModal);
  }

  showModal() {
    this.show = true;
  }

  closeModal(e: MouseEvent) {
    const containsModelClass = (e.target as HTMLElement).classList.contains(this.modalClass);
    const containsCloseIcon = (e.target as HTMLElement).classList.contains("close-icon");
    this.show = !(containsModelClass || containsCloseIcon);
  }
}
</script>
