<template>
  <div class="w-full px-16 h-screen flex flex-col pt-16">
    <Button
      @click="backHome"
      variant="link"
      class="mt-2 text-zinc-500 dark:text-zinc-400 absolute left-2 top-2"
    >
      <ArrowLeftIcon class="w-4 h-4 mr-2" />Back to Home
    </Button>
    <div class="md:flex md:flex-col md:items-center">
      <div class="mb-4 lg:w-1/2">
        <h1
          class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
        >
          New Project
        </h1>
        <p
          class="text-base text-zinc-400 dark:text-zinc-500 my-2 lg:my-4 lg:pr-4"
        >
          Create a new project and associate it with a team. Start by giving
          your project a name and description, then choose a team.
        </p>
        <Input
          id="title"
          type="text"
          placeholder="Enter Title"
          v-model="title"
          class="w-full h-12 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-8"
        />
        <div v-if="errors.title" class="error absolute text-xs mt-1">
          {{ errors.title }}
        </div>
        <Textarea
          id="description"
          type="text"
          placeholder="Enter Description"
          v-model="description"
          class="w-full h-12 lg:h-40 text-sm sm:text-base p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 border dark:border-zinc-600 mt-2"
        />
        <div v-if="errors.description" class="error absolute text-xs mt-1">
          {{ errors.description }}
        </div>
        <div class="flex flex-col">
          <Select id="team" v-model="selectedTeam">
            <SelectTrigger
              class="w-full mt-4 text-sm sm:text-base bg-zinc-50 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 border dark:border-zinc-600"
            >
              <SelectValue
                placeholder="Choose a team to associate this project with"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Teams</SelectLabel>
                <SelectItem
                  v-for="team in teams"
                  :key="team.team_id"
                  :value="team.team_id"
                >
                  {{ team.teams.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        @click="handleCreateProject"
        class="w-full mt-6 md:w-96 md:mt-8 lg:mt-14 bg-green-600 text-white"
        >Create Project</Button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, type Ref, ref } from "vue";
import { ArrowLeftIcon } from "lucide-vue-next";
import { navigateTo } from "nuxt/app";

interface Errors {
  title?: string;
  description?: string;
}

const title = ref<string>(""); // Title is a string
const description = ref<string>(""); // Description is a string
const errors = ref<Errors>({}); // errors is an object with optional fields

const teams = ref<any[]>([]); // Store user's teams here
const selectedTeam = ref<string | null>(null); // Store selected team
const user = useSupabaseUser();
const supabase = useSupabaseClient();

onMounted(async () => {
  if (user.value) {
    const { data, error } = await supabase
      .from("team_members")
      .select("team_id, teams(name)")
      .eq("user_id", user.value.id);

    if (error) {
      console.error("Error fetching teams:", error.message);
    } else {
      teams.value = data || [];
    }
  }
});

async function handleCreateProject() {
  if (!title.value) {
    errors.value.title += "Project title is required";
    return;
  }

  if (!selectedTeam.value) {
    errors.value.title += "You must select a team";
    return;
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title: title.value,
      team_id: selectedTeam.value,
    })
    .select();

  if (error) {
    console.error("Error creating project:", error.message);
    return;
  }

  if (project.length > 0) {
    const projectId = project[0].id;
    const { error: projectMemberError } = await supabase
      .from("project_members")
      .insert({
        project_id: projectId,
        user_id: user.value.id,
        role: "owner",
      });

    if (projectMemberError) {
      console.error("Error adding project member:", projectMemberError.message);
    } else {
      console.log("Project created successfully!");
      navigateTo(`/project/${projectId}`);
    }
  }
}
const backHome = () => {
  navigateTo("/");
};
</script>

<style></style>
