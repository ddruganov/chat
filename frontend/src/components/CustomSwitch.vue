<template>
  <div class="switch-custom d-flex align-items-center w-fit-content" @click="onChange">
    <div class="box border rounded" :class="{ active: modelValue }">
      <div class="check" />
    </div>
    <div class="caption ms-2">
      <span v-if="label">
        {{ label }}
      </span>
      <slot v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.switch-custom {
  --size: 0px;
  user-select: none !important;
  cursor: pointer;
  .caption {
    font-size: inherit;
  }
  .box {
    min-width: var(--size);
    width: var(--size);
    max-width: var(--size);
    min-height: var(--size);
    height: var(--size);
    max-height: var(--size);
    transition: 0.125s all linear;
    &.active {
      background-color: #007bff;
      position: relative;
      transition: 0.125s all linear;
      .check {
        position: absolute;
        width: calc(var(--size) * 0.6);
        height: calc(var(--size) * 0.4);
        border-left: 1px solid white;
        border-bottom: 1px solid white;
        left: calc(var(--size) * 0.15);
        top: calc(var(--size) * 0.15);
        transform: rotate(-45deg);
      }
    }
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class CustomSwitch extends Vue {
  @Prop(Boolean) readonly modelValue!: boolean;
  @Prop(String) readonly label!: string;
  @Prop(Number) size!: number;

  mounted() {
    this.size ||= 20;
    this.$el.style.setProperty("--size", this.size + "px");
  }

  onChange() {
    this.$emit("update:modelValue", !this.modelValue);
    this.$emit("change", !this.modelValue);
  }
}
</script>
