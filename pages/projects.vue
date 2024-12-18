<template>
  <div>
    <PageHeader />
    <div
      class="bg-zinc-50 dark:bg-black"
    >
      <div class="container w-full pt-8 md:pt-10 lg:pt-14">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Your Projects
        </h1>
      </div>
      <div class="container w-full flex flex-row justify-between pt-8">
        <div class="relative w-full max-h-10 pr-2 items-center">
          <Input
            id="searchProjects"
            type="text"
            v-model="searchQuery"
            placeholder="Search Projects..."
            class="pl-10 text-base md:text-sm"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-6 text-muted-foreground" />
          </span>
          <Drawer v-if="isMobile" v-model:open="isOpen">
            <DrawerTrigger as-child>
              <Button
                as-child
                size="icon"
                variant="ghost"
                class="absolute end-3 inset-y-0 max-w-[32px] hover:bg-transparent transform active:translate-y-px transition-transform"
              >
                <span class="flex items-center justify-center">
                  <Ellipsis class="size-4 text-muted-foreground" />
                </span> </Button
            ></DrawerTrigger>
            <DrawerContent>
              <div class="mx-auto mt-4 mb-8 w-full max-w-sm">
                <RadioGroup
                  v-model="selectedSortOption"
                  class="flex flex-col gap-4"
                >
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="SortByActivity"
                      value="SortByActivity"
                      @click="closeDrawer"
                    />
                    <Label for="SortByActivity" class="text-base font-normal"
                      >Sort by Activity</Label
                    >
                  </div>
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="SortByName"
                      value="SortByName"
                      @click="closeDrawer"
                    />
                    <Label for="SortByName" class="text-base font-normal"
                      >Sort by Name</Label
                    >
                  </div>
                </RadioGroup>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <Select v-if="!isMobile" v-model="selectedSortOption">
          <SelectTrigger class="max-w-36 mr-2">
            <SelectValue placeholder="Sort By..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="SortByActivity">Sort By Activity</SelectItem>
              <SelectItem value="SortByName">Sort By Name</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          @click="navigateTo('/create-project')"
          v-if="isMobile"
          size="icon"
          class="min-w-[40px] text-zinc-100 dark:text-zinc-900"
        >
          <Plus class="size-4" />
        </Button>
        <Button
          @click="navigateTo('/create-project')"
          v-else
          class="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          New Project<Plus class="size-4 ml-2" />
        </Button>
      </div>
      <div class="min-h-screen">
        <div
          class="container w-full grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-3 justify-center"
        >
          <Card
            v-for="(project, index) in filteredProjects"
            :key="index"
            class="mt-6 hover:border-indigo-600 relative"
          >
            <NuxtLink
              :to="{
                name: 'project-projectId',
                params: { projectId: project.id },
              }"
            >
              <CardHeader class="gap-2">
                <CardTitle>
                  <div>
                    <h1 class="text-xl hover:underline">{{ project.title }}</h1>
                    <p class="text-base font-light text-zinc-500 mt-1">
                      {{ project.id }}
                    </p>
                  </div>
                </CardTitle>
                <CardDescription
                  ><Badge class="mt-2">{{ project.team_name }}</Badge
                  ><br
                /></CardDescription>
              </CardHeader>
              <CardContent>
                <p>{{ project.description }}</p>
              </CardContent>
            </NuxtLink>

            <!-- Editable Input Field for Project Title -->
            <div v-if="editingProjectId === project.id" class="p-4">
              <input
                v-model="editTitle"
                placeholder="Edit Project Name"
                class="w-full p-2 border rounded-md text-black"
              />
              <button
                @click="saveProjectTitle(project.id)"
                class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                @click="cancelEditing"
                class="mt-2 ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { PageHeader } from "@/components/custom/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "@vueuse/core";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const isMobile = useMediaQuery("(max-width: 600px)");

const isOpen = ref(false);
const selectedSortOption = ref("SortByActivity");
const searchQuery = ref("");


const projects = ref([]);
const fetchProjects = async () => {
  const { data: associatedProjects, error: associatedError } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.value.id);

  if (associatedError) {
    console.error("Error fetching projects: ", associatedError);
    return;
  }

  // fetch details about a project that the user is in
  const projectIds = associatedProjects?.map((p) => p.project_id);
  const { data: projectDetails, error: projectDetailsError } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds || []);

  if (projectDetailsError) {
    console.error("Error fetching project details:", projectDetailsError);
    return;
  }

  // get the teams associated with each project the user is part of
  const teamIds = projectDetails.map((project) => project.team_id);
  const { data: teamDetails, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .in("id", teamIds || []);

  if (teamError) {
    console.error("Error fetching team details:", teamError);
    return;
  }

  const projectsWithTeamNames = projectDetails.map((project) => {
    const team = teamDetails.find((team) => team.id === project.team_id);
    return {
      ...project,
      team_name: team ? team.team_name : "Unknown Team",
    };
  });

  projects.value = projectsWithTeamNames;
  sortProjects();
};


const closeDrawer = () => {
  isOpen.value = false;
};

onMounted(() => {
  fetchProjects();
});

// sorting functions
const sortProjects = () => {
  if (selectedSortOption.value === "SortByName") {
    projects.value.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSortOption.value === "SortByActivity") {
    // Placeholder for another sorting logic based on activity or any other criteria
  }
};

// Watch for changes in sort option to trigger sorting immediately
watch(selectedSortOption, () => {
  sortProjects();
});

// filter projects based on search query
const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return projects.value.filter((project) =>
    project.title.toLowerCase().includes(query)
  );
});
</script>

<style></style>
