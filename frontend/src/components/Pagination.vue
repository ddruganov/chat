<template>
  <div class="d-flex justify-content-center mx-auto bg-white rounded-10 p-3 w-fit-content">
    <div
      v-for="i in pageCount"
      :key="i"
      class="page rounded mx-1"
      :class="currentPage === i ? 'bg-primary text-white' : ''"
      @click="changePage(i)"
    >
      <span class="m-auto">{{ i }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.page {
  display: flex;
  cursor: pointer;
  width: 20px;
  height: 20px;
  &:hover {
    background: #eee;
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Pagination extends Vue {
  @Prop({ type: Number, required: true }) readonly currentPage!: number;
  @Prop({ type: Number, required: true }) readonly pageCount!: number;

  changePage(page: number) {
    this.$emit("change", page);
  }
}
</script>
