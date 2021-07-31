<template>
  <div class="auth-layout">
    <div class="container content">
      <div class="login-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class AuthLayout extends Vue {}
</script>
