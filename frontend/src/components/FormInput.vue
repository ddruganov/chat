<template>
  <div class="input-wrapper">
    <textarea
      v-if="type === 'textarea'"
      class="input"
      v-model="input"
      @input="() => onInput()"
      @change="() => onChange()"
      @keypress="(e) => handleKeyPress(e)"
      required
    />
    <input
      v-else
      class="input"
      type="text"
      v-model="input"
      @input="() => onInput()"
      @change="() => onChange()"
      @keypress="(e) => handleKeyPress(e)"
      required
    />
    <label class="label">{{ label }}</label>
    <span class="error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

export default class FormInput extends Vue {
  @Prop(String) readonly modelValue!: string;
  @Prop(String) readonly type!: string;
  @Prop(String) readonly label!: string;
  @Prop(String) readonly error!: string;
  @Prop(Number) readonly inputEventDelay!: number;

  private timer = 0;

  @Watch("modelValue") onModelValueChanged() {
    this.input = this.modelValue;
  }

  private input = "";

  mounted() {
    this.input = this.modelValue;
  }

  onInput() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.$emit("update:modelValue", this.input);
      this.$emit("input", this.input);
    }, this.inputEventDelay || 0);
  }

  onChange() {
    this.$emit("change", this.input);
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (e.key !== "Enter" || e.shiftKey) {
      return;
    }

    const target = e.target as HTMLInputElement;
    target.form?.dispatchEvent(new Event("submit", { cancelable: true }));
    e.preventDefault();
  }
}
</script>
