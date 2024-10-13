<template>
  <div>
    <PageHeader />
    <div class="min-h-screen bg-black">
      <div class="py-6 md:py-8 mx-auto px-8 lg:w-[1200px]">
        <h1
          class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
        >
          {{ projectInfo.title }}
        </h1>
      </div>
      <Separator class="w-full" />
      <div class="my-8 mx-auto px-8 lg:w-[1200px]">
        <SharedTodoList :projectId="projectId" />
      </div>
      <Separator class="w-full" />
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { SharedTodoList } from "@/components/ui/shared-todo-list";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "@/components/ui/page-header";
import { PageFooter } from "@/components/ui/page-footer";

const supabase = useSupabaseClient();

const route = useRoute();
const projectId = route.params["projectId"];
const projectInfo = ref({});

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

  projectInfo.value = projectDetails;
};

onMounted(() => {
  fetchProjectDetails();
});
</script>
