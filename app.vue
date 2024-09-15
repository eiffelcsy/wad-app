<template>
  <div>
    <NuxtRouteAnnouncer />
  </div>
  <NuxtPage />
  <Button
    @click="toggleDarkMode"
    class="absolute bottom-4 right-4 p-2 size-9 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-full"
  >
    <SunIcon v-if="isDark" />
    <MoonIcon v-else />
  </Button>
</template>

<script setup>
import { SunIcon, MoonIcon } from "@radix-icons/vue";

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
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
