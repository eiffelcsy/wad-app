<!-- TODO: Projects homepage, include create, edit and delete buttons for each project, maybe in a table -->
<template>
  <div>
    <div>
      <PageHeader />
    </div>
    <div
      class="w-full px-8 flex flex-row justify-between mt-8 md:mt-10 lg:mt-12"
    >
      <div class="relative w-full max-h-10 pr-2 items-center">
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
            <div class="mx-auto mb-8 w-full max-w-sm">
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
                  <Label for="SortByActivity" class="text-base"
                    >Sort by Activity</Label
                  >
                </div>
                <div class="flex items-center space-x-4">
                  <RadioGroupItem
                    id="SortByName"
                    value="SortByName"
                    @click="closeDrawer"
                  />
                  <Label for="SortByName" class="text-base">Sort by Name</Label>
                </div>
              </RadioGroup>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <Select v-if="!isMobile">
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
      <Card v-for="(project, index) in projects" :key="index" class="mt-6">
        <CardHeader class="gap-2">
          <CardTitle>
            <div>
              <h1 class="text-xl">{{ project.title }}</h1>
              <Button variant="link" class="px-0 py-1">
                <NuxtLink
                  class="text-base font-light text-zinc-500"
                  :to="{
                    name: 'project-projectId',
                    params: { projectId: project.id },
                  }"
                  >{{ project.id }}</NuxtLink
                >
              </Button>
            </div>
          </CardTitle>
          <CardDescription
            ><Badge>{{ project.team_name }}</Badge
            ><br
          /></CardDescription>
        </CardHeader>
        <CardContent>
          <p>{{ project.description }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PageHeader } from "@/components/ui/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "@vueuse/core";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const isMobile = useMediaQuery("(max-width: 600px)");

const isOpen = ref(false);
const selectedSortOption = ref("SortByActivity");

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

  const projectIds = associatedProjects?.map((p) => p.project_id);
  const { data: projectDetails, error: projectDetailsError } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds || []);

  if (projectDetailsError) {
    console.error("Error fetching project details:", projectDetailsError);
    return;
  }

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
      team_name: team ? team.name : "Unknown Team",
    };
  });

  projects.value = projectsWithTeamNames;
};

const closeDrawer = () => {
  isOpen.value = false;
};

onMounted(() => {
  fetchProjects();
});
</script>

<style></style>
