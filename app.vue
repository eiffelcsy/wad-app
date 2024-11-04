<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtLoadingIndicator color="#4f46e5" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup></script>

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
