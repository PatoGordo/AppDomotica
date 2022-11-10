<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
  pageTransition: {
    name: "slide-fade",
    mode: "out-in",
  },
});
</script>

<template>
  <div class="page-content">
    <h2>Dashboard</h2>

    <p>You must to be admin or editor to access page below</p>
    <p>Change in your database your user role to 2 or 3</p>
    <nuxt-link to="/dashboard/protected-route" class="btn btn-primary btn-sm">
      Go to /dashboard/protected-route
    </nuxt-link>
  </div>
</template>
