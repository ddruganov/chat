<template>
  <div class="switch-wrapper d-flex align-items-center w-fit-content" @click="onChange">
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

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class FormSwitch extends Vue {
  @Prop(Boolean) readonly modelValue!: boolean;
  @Prop(String) readonly label!: string;
  @Prop(Number) size!: number;

  private get defaultSize() {
    return 20;
  }

  mounted() {
    this.size ||= this.defaultSize;
    this.$el.style.setProperty("--size", this.size + "px");
  }

  onChange() {
    this.$emit("update:modelValue", !this.modelValue);
    this.$emit("change", !this.modelValue);
  }
}
</script>
