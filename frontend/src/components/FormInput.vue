<template>
  <div class="input-wrapper">
    <input class="input" type="text" v-model="input" @input="() => onChange()" required />
    <label class="label">{{ label }}</label>
    <span class="error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class FormInput extends Vue {
  @Prop(String) readonly modelValue!: string;
  @Prop(String) readonly label!: string;
  @Prop(String) readonly error!: string;

  private input = "";

  mounted() {
    this.input = this.modelValue;
  }

  onChange() {
    this.$emit("update:modelValue", this.input);
    this.$emit("change", this.input);
  }
}
</script>
