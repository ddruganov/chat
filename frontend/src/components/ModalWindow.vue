<template>
  <div :id="id" @click="closeModal">
    <transition name="fade">
      <div v-if="show" class="modal" :class="{ [modalClass]: modalClass }">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="d-flex align-items-center justify-content-between w-100">
                <slot name="title" />
                <button class="btn-close btn btn-sm p-0" @click="closeModal">
                  <i class="close-icon fas fa-times" />
                </button>
              </div>
            </div>
            <div class="modal-body">
              <slot name="body" />
            </div>
            <div class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  background: rgba(black, 0.5);
  display: block;
  .btn-close {
    line-height: 0;
    .close-icon {
      font-size: 1.25rem;
      color: #999;
    }
    &:hover {
      .close-icon {
        color: black;
      }
    }
  }
  .modal-body {
    display: flex;
    flex-direction: column;
  }
}

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
  @Prop(String) readonly control!: string;
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
