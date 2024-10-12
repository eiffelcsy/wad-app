<template>
  <div>
    <NuxtRouteAnnouncer />
  </div>
  <NuxtPage />
</template>

<script setup>
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(1px);
}
</style>
