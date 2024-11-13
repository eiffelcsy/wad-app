<template>
  <div>
    <PageHeader />
    <div
      class="w-full px-8 min-h-screen flex flex-col pt-8 pb-10 items-center bg-zinc-50 dark:bg-black"
    >
      <div class="mx-auto w-full lg:w-1/2">
        <h1
          class="text-2xl md:text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
        >
          New Project
        </h1>
        <p class="text-base text-zinc-400 dark:text-zinc-500">
          Create a new project and associate it with a team. You can only do so
          if you are the owner or an admin of that team. Start by giving your
          project a name and description, then choose a team.
        </p>
        <Card class="mt-4 md:mt-8 lg:mt-12 hover:border-indigo-600">
          <CardContent class="pt-4">
            <div>
              <h1
                class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
              >
                Title
              </h1>
              <Input
                id="title"
                type="text"
                placeholder="Enter Title"
                v-model="title"
              />
              <div v-if="errors.title" class="error absolute text-xs mt-1">
                {{ errors.title }}
              </div>
            </div>
            <div class="pt-4">
              <h1
                class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
              >
                Description
              </h1>
              <Textarea
                id="description"
                type="text"
                placeholder="Enter Description"
                v-model="description"
              />
            </div>
            <div class="pt-6 pb-4 lg:pt-8">
              <Select id="team" v-model="selectedTeam">
                <SelectTrigger>
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
                      :disabled="!['owner', 'admin'].includes(team.role)"
                    >
                      <span
                        :title="
                          ['owner', 'admin'].includes(team.role)
                            ? ''
                            : 'You are not the owner or an admin of this team'
                        "
                        :class="
                          !['owner', 'admin'].includes(team.role)
                            ? 'text-gray-400 cursor-not-allowed'
                            : ''
                        "
                      >
                        {{ team.teams.team_name }}
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div v-if="errors.team" class="error absolute text-xs mt-1">
                {{ errors.team }}
              </div>
            </div>

            <!-- Add the TagsInput for selecting team members -->
            <div v-if="selectedTeam">
              <h1
                class="text-base md:text-xl lg:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold my-2 lg:my-4"
              >
                Add Team Members to Project
              </h1>
              <TagsInput
                class="px-0 gap-0 w-full"
                :model-value="selectedMembers"
              >
                <div class="flex gap-2 flex-wrap items-center px-3">
                  <TagsInputItem
                    v-for="member in selectedMembers"
                    :key="member.user_id"
                    :value="member.name"
                  >
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                </div>

                <ComboboxRoot
                  v-model="selectedMembers"
                  v-model:open="open"
                  v-model:search-term="searchTerm"
                  class="w-full"
                >
                  <ComboboxAnchor as-child>
                    <ComboboxInput
                      placeholder="Select team members..."
                      as-child
                    >
                      <TagsInputInput
                        class="w-full px-3"
                        :class="selectedMembers.length > 0 ? 'mt-2' : ''"
                        @keydown.enter.prevent
                      />
                    </ComboboxInput>
                  </ComboboxAnchor>

                  <ComboboxPortal>
                    <ComboboxContent>
                        <CommandList position="popper"
                      class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                        <CommandEmpty/>
                        <CommandGroup>
                          <CommandItem
                            v-for="member in filteredTeamMembers"
                            :key="member.user_id"
                            :value="{ user_id: member.user_id, name: member.name}"
                            @select.prevent="
                              (ev) => {
                                  searchTerm = '';
                                  selectedMembers.push({ user_id: ev.detail.value.user_id, name: ev.detail.value.name});
                              }
                            "
                          >
                            {{ member.name }}
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </ComboboxContent>
                  </ComboboxPortal>
                </ComboboxRoot>
              </TagsInput>
            </div>
          </CardContent>
        </Card>
        <Button
          @click="handleCreateProject"
          class="mt-6 md:mt-8 lg:mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >Create Project</Button
        >
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { navigateTo } from "nuxt/app";
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";

// Import the components needed for the tags input
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from "radix-vue";

interface Errors {
  title?: string;
  team?: string;
}

const title = ref<string>("");
const description = ref<string>("");
const errors = ref<Errors>({});

const teams = ref<any[]>([]);
const selectedTeam = ref<string | null>(null);
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const teamMembers = ref<any[]>([]);
const selectedMembers = ref<any[]>([]); // Store selected member IDs
const searchTerm = ref("");
const open = ref(false);

// Fetch teams on mount and filter based on role
onMounted(async () => {
  if (user.value) {
    const { data, error } = await supabase
      .from("team_members")
      .select("team_id, teams(team_name), role")
      .eq("user_id", user.value.id);

    if (error) {
      console.error("Error fetching teams:", error.message);
    } else {
      teams.value = data || [];
    }
  }
});

// Watch selectedTeam to fetch team members
watch(selectedTeam, async (newTeamId) => {
  if (newTeamId) {
    const { data, error } = await supabase
      .from("team_members")
      .select("user_id, name")
      .eq("team_id", newTeamId)
      .neq("name", null)
      .neq("user_id", user.value.id);

    if (error) {
      console.error("Error fetching team members:", error.message);
    } else {
      teamMembers.value = data || [];
    }
  } else {
    teamMembers.value = [];
    selectedMembers.value = [];
  }
});

const filteredTeamMembers = computed(() => {
  return teamMembers.value.filter(
    (member) => !selectedMembers.value.includes(member.user_id)
  );
});

const ValidateProject = (): Boolean => {
  let isValid = true;
  errors.value = {};

  if (!title.value) {
    errors.value.title = "Project title is required";
    isValid = false;
  }

  if (!selectedTeam.value) {
    errors.value.team = "You must select a team";
    isValid = false;
  }

  return isValid;
};

async function handleCreateProject() {
  if (!ValidateProject()) {
    return;
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title: title.value,
      description: description.value,
      team_id: selectedTeam.value,
    })
    .select();

  if (error) {
    console.error("Error creating project:", error.message);
    return;
  }

  if (project.length > 0) {
    const projectId = project[0].id;

    // Prepare the project members to insert
    const projectMembers = selectedMembers.value.map((member) => {
      return {
        project_id: projectId,
        user_id: member.user_id,
        name: member.name,
        role: "member",
      };
    });

    // Add the current user as owner
    projectMembers.push({
      project_id: projectId,
      user_id: user.value.id,
      name: user.value.user_metadata.name,
      role: "owner",
    });

    const { error: projectMemberError } = await supabase
      .from("project_members")
      .insert(projectMembers);

    if (projectMemberError) {
      console.error(
        "Error adding project members:",
        projectMemberError.message
      );
    } else {
      navigateTo(`/project/${projectId}`);
    }
  }
}
</script>

<style>
.error {
  color: red;
}

.text-gray-400 {
  color: #a0a0a0; /* Grey out the text */
}
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
