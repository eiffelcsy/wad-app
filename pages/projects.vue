<!-- TODO: Projects homepage, include create, edit and delete buttons for each project, maybe in a table -->
<template>
  <div>
    <div>
      <PageHeader />
    </div>
    <div class="w-full px-8 flex flex-row justify-between mt-8 md:mt-10 lg:mt-12">
      <div class="relative w-full max-h-10 pr-4 items-center">
        <Input
          id="search"
          type="text"
          placeholder="Search Projects..."
          class="pl-10 text-base md:text-sm"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Search class="size-6 text-muted-foreground" />
        </span>
        <Button
          as-child
          size="icon"
          variant="ghost"
          class="max-w-[32px] hover:bg-transparent transform active:translate-y-px transition-transform"
        >
          <span
            class="absolute end-0 inset-y-0 flex items-center justify-center mr-4"
          >
            <Ellipsis class="size-4 text-muted-foreground" />
          </span>
        </Button>
      </div>
      <Button
        v-if="isMobile"
        size="icon"
        class="min-w-[40px] text-zinc-100 dark:text-zinc-900"
      >
        <Plus class="size-4" />
      </Button>
      <Button v-else class="text-zinc-100 dark:text-zinc-900">
        New Project <Plus class="size-4 ml-2" />
      </Button>
    </div>
    <div
      class="w-full px-8 grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-3 justify-center"
    >
      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Placeholder Project</CardTitle>
          <CardDescription>Placeholder Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Some Placeholder Content here</p>
        </CardContent>
      </Card>
      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Placeholder Project</CardTitle>
          <CardDescription>Placeholder Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Some Placeholder Content here</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from "nuxt/app";
import { ref } from "vue";
import { PageHeader } from "@/components/ui/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMediaQuery } from "@vueuse/core";

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
const isMobile = useMediaQuery("(max-width: 600px)");
</script>

<style></style>
