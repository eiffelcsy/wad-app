<template>
  <footer class="p-8 border-t border-zinc-200 dark:border-zinc-800">
    <div class="flex flex-col mx-auto md:max-w-[65%]">
      <!-- First Row -->
      <div class="flex justify-between items-center">
        <!-- Left section with logo and system status -->
        <div class="flex items-center space-x-2">
          <p class="text-base font-semibold tracking-wider">MeetLah</p>
          <p class="text-base">© 2024</p>
        </div>

        <!-- Command Menu and Theme Toggle -->
        <div class="flex flex-row items-center space-x-4">
          <Button
            v-if="isDesktop"
            @click="handleOpenChange()"
            variant="ghost"
            class="text-sm font-light hover:text-gray-400 p-2"
          >
            Command Menu
            <kbd
              class="ml-2 pointer-events-none inline-flex select-none items-center gap-1 rounded border px-1.5 py-0.5 font-mono font-medium text-muted-foreground opacity-100"
            >
              <span class="text-xs">⌘</span>J
            </kbd>
          </Button>
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

      <!-- Second Row for Medium and Above: Navigation Links in Same Row as Logo -->
      <div
        class="hidden md:flex md:justify-between md:items-center md:mt-4 text-sm"
      >
        <NuxtLink to="https://github.com/eiffelcsy/wad-app">
          <GithubLogoIcon class="size-5" />
        </NuxtLink>
        <NuxtLink to="/" class="hover:text-gray-400">Home</NuxtLink>
        <NuxtLink to="/landing" class="hover:text-gray-400">Landing Page</NuxtLink>
        
      </div>

      <!-- Small Viewports: Original Layout -->
      <div class="grid grid-cols-2 gap-4 text-sm mt-8 md:hidden">
        <NuxtLink to="/" class="hover:text-gray-400">Home</NuxtLink>
        <NuxtLink to="/landing" class="hover:text-gray-400">Landing Page</NuxtLink>
      </div>
      <div class="flex mt-8 md:hidden">
        <NuxtLink to="https://github.com/eiffelcsy/wad-app">
          <GithubLogoIcon class="size-5" />
        </NuxtLink>
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
import { AppCommands } from "@/components/custom/app-commands";

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