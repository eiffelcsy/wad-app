<template>
  <footer class="p-8 border-t border-zinc-200">
    <div class="flex flex-col mx-auto md:max-w-[85%]">
      <div class="flex justify-between items-center">
        <!-- Left section with logo and system status -->
        <div class="flex items-center space-x-2">
          <p class="text-sm font-semibold tracking-wider">MeetLah</p>
          <p class="text-sm">© 2024</p>
        </div>

        <!-- Bottom-right section with command menu and theme toggle -->
        <div class="flex flex-row">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" class="text-sm font-light hover:text-gray-400">Command Menu</Button>
          </div>
          <Button
            variant="icon"
            @click="toggleDarkMode"
            class="ml-4 w-10 p-2 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white rounded-full"
          >
            <SunIcon v-if="isDark" />
            <MoonIcon v-else />
          </Button>
        </div>
      </div>
      <!-- Right section with navigation links -->
      <div class="flex flex-col md:flex-row justify-between mt-8">
        <div class="order-last md:order-first mt-8 md:mt-0">
          <NuxtLink to="https://github.com/eiffelcsy/wad-app"
            ><GithubLogoIcon class="size-5"
          /></NuxtLink>
        </div>
        <div
          class="w-full md:pl-4 lg:pl-0 lg:w-2/3 grid grid-cols-2 gap-4 md:gap-0 md:flex md:justify-between items-center md:space-x-4 text-sm"
        >
          <NuxtLink href="#" class="hover:text-gray-400">Home</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400"
            >Documentation</NuxtLink
          >
          <NuxtLink href="#" class="hover:text-gray-400">Guides</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400">Help</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400"
            >Contact Sales</NuxtLink
          >
          <NuxtLink href="#" class="hover:text-gray-400">Blog</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400">Changelog</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { GithubLogoIcon } from "@radix-icons/vue";
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

<style scoped></style>
