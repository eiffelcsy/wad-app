<template>
  <footer class="p-8 border-t border-zinc-200">
    <div class="flex flex-col mx-auto md:max-w-[65%]">
      <div class="flex justify-between items-center">
        <!-- Left section with logo and system status -->
        <div class="flex items-center space-x-2">
          <p class="text-sm font-semibold tracking-wider">MeetLah</p>
          <p class="text-sm">© 2024</p>
        </div>

        <!-- Bottom-right section with command menu and theme toggle -->
        <div class="flex flex-row">
          <div class="flex items-center space-x-4">
            <Button
              variant="ghost"
              class="text-sm font-light hover:text-gray-400 mr-2"
              >Command Menu</Button
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const colorMode = useColorMode();
</script>

<style scoped></style>
