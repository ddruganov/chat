<template>
  <div :id="id" @click="closeModal" class="modal-window">
    <transition name="fade">
      <div v-if="show" class="modal" :class="{ [modalClass]: modalClass }">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div v-if="!hideHeader" class="modal-header">
              <div class="d-flex align-items-center justify-content-between w-100">
                <slot name="title" />
                <i class="close-icon fas fa-times" @click="closeModal" />
              </div>
            </div>
            <div class="modal-body">
              <slot name="body" />
            </div>
            <div v-if="!hideFooter" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
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

export default class ModalWindowComponent extends Vue {
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
  }

  load() {
    document.querySelector(`[modal-trigger="${this.id}"]`)?.addEventListener("click", this.showModal);
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
