<template>
  <footer class="p-8 border-t border-zinc-200 dark:border-zinc-800">
    <div class="flex flex-col mx-auto md:max-w-[65%]">
      <div class="flex justify-between items-center">
        <!-- Left section with logo and system status -->
        <div class="flex items-center space-x-2">
          <p class="text-base font-semibold tracking-wider">MeetLah</p>
          <p class="text-base">© 2024</p>
        </div>

        <!-- Bottom-right section with command menu and theme toggle -->
        <div class="flex flex-row">
          <div class="flex items-center space-x-4">
            <Button
              v-if="isDesktop"
              @click="handleOpenChange()"
              variant="ghost"
              class="text-sm font-light hover:text-gray-400 mr-2 p-2"
              >Command Menu<kbd
                class="ml-2 pointer-events-none inline-flex select-none items-center gap-1 rounded border px-1.5 py-0.5 font-mono font-medium text-muted-foreground opacity-100"
              >
                <span class="text-xs">⌘</span>J
              </kbd></Button
            >
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="icon">
                <MoonIcon
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <SunIcon
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="colorMode.preference = 'light'">
                Light
              </DropdownMenuItem>
              <DropdownMenuItem @click="colorMode.preference = 'dark'">
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem @click="colorMode.preference = 'system'">
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <NuxtLink href="/" class="hover:text-gray-400">Home</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400"
            >Documentation</NuxtLink
          >
          <NuxtLink href="#" class="hover:text-gray-400">Guides</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400">Help</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400"
            >Contact</NuxtLink
          >
          <NuxtLink href="#" class="hover:text-gray-400">Blog</NuxtLink>
          <NuxtLink href="#" class="hover:text-gray-400">Changelog</NuxtLink>
        </div>
      </div>
    </div>
    <AppCommands :open="open" @update:open="handleOpenChange" />
  </footer>
</template>

<script setup>
import { GithubLogoIcon } from "@radix-icons/vue";
import { SunIcon, MoonIcon } from "@radix-icons/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMagicKeys, useMediaQuery } from "@vueuse/core";
import { ref, watch } from "vue";
import { AppCommands } from "@/components/ui/app-commands";

const open = ref(false);
const isDesktop = useMediaQuery("(min-width: 768px)");

const colorMode = useColorMode();
const { Meta_J, Ctrl_J } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'j' && (e.metaKey || e.ctrlKey))
      e.preventDefault()
  },
})
function handleOpenChange() {
  open.value = !open.value;
}

watch([Meta_J, Ctrl_J], (v) => {
  if (v[0] || v[1])
    handleOpenChange()
})

</script>

<style scoped></style>
