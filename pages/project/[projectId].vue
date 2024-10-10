<template>
  <div>
    <div class="w-full p-16 flex flex-col">
      <h1 class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold">{{ projectTitle }}</h1>
      <p class="text-base text-zinc-400 dark:text-zinc-500">Project Management</p>
    <SharedTodoList :projectId="projectId" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { SharedTodoList } from "@/components/ui/shared-todo-list";
import { ArrowLeftIcon } from "lucide-vue-next";

const supabase = useSupabaseClient();

const route = useRoute();
const projectId = route.params["projectId"];
const projectTitle = ref("");

const fetchProjectDetails = async () => {
  const { data: projectDetails, error: projectDetailsError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectDetailsError) {
    console.error("Error fetching project details:", projectDetailsError);
    return;
  }

  projectTitle.value = projectDetails.title;
}

onMounted(() => {
  fetchProjectDetails();
});
</script>
