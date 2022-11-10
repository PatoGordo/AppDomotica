<script lang="ts" setup>
import "sweetalert2/src/sweetalert2.scss";
useHead({
  script: [
    {
      src: "https://code.iconify.design/iconify-icon/1.0.0-beta.3/iconify-icon.min.js",
    },
  ],
});
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<style lang="scss">
@import "~~/styles/style.scss";
</style>
