<template>
  <div>
    <div class="w-full px-16 h-screen flex flex-col mt-16">
      <h1 class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold">Placeholder Project Title</h1>
      <p class="text-base text-zinc-400 dark:text-zinc-500">Project Management</p>
    <SharedTodoList :projectId="projectId" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { SharedTodoList } from "@/components/ui/shared-todo-list";
import { ArrowLeftIcon } from "lucide-vue-next";

const route = useRoute();
const projectId = route.params["projectId"];
</script>
