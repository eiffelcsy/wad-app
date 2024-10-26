<template>
  <div>
    <PageHeader />
    <div class="bg-zinc-50 dark:bg-black min-h-screen">
      <div class="container w-full pt-8 md:pt-10 lg:pt-14">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold">Your Teams</h1>
      </div>
      <div class="container w-full flex flex-row justify-between pt-8">
        <!-- Search bar with original styling -->
        <div class="relative w-full max-h-10 pr-2 items-center">
          <Input
            id="searchTeams"
            type="text"
            placeholder="Search Teams..."
            class="pl-10 text-base md:text-sm"
            v-model="searchQuery"
          />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>
        <Button
          @click="navigateTo('/create-team')"
          class="text-zinc-100 dark:text-zinc-900"
        >
          New Team
          <Plus class="size-4 ml-2" />
        </Button>
      </div>
      <div class="container w-full py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
            <CardDescription>Showing all your teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-1/6">Team Name</TableHead>
                  <TableHead class="w-1/6">Members</TableHead>
                  <TableHead class="w-1/6">Created On</TableHead>
                  <TableHead class="w-1/6">Created By</TableHead>
                  <TableHead class="w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="teams.length === 0">
                  <TableCell colspan="5" class="text-center">No Teams Found.</TableCell>
                </TableRow>
                <TableRow v-for="team in filteredTeams" :key="team.id">
                  <TableCell>{{ team.team_name }}</TableCell>
                  <TableCell>{{ team.membersCount }}</TableCell>
                  <TableCell>{{ formatDate(team.created_at) }}</TableCell>
                  <TableCell>{{ team.createdByName || 'Unknown' }}</TableCell>
                  <TableCell>
                    <div class="flex space-x-4">
                      <!-- Owner Actions -->
                      <div v-if="team.role === 'owner'" class="flex space-x-2">
                        <div class="relative group">
                          <Pencil1Icon class="cursor-pointer" @click="manageTeam(team.id)" />
                          <span
                            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                          >
                            Manage Team
                          </span>
                        </div>
                        <div class="relative group">
                          <TrashIcon class="cursor-pointer text-red-500" @click="deleteTeam(team.id)" />
                          <span
                            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                          >
                            Delete Team
                          </span>
                        </div>
                      </div>

                      <!-- Member Actions -->
                      <div v-else class="flex space-x-2">
                        <div class="relative group">
                          <EyeOpenIcon class="cursor-pointer" @click="viewTeam(team.id)" />
                          <span
                            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                          >
                            View More
                          </span>
                        </div>
                        <div class="relative group">
                          <ExitIcon class="cursor-pointer text-red-500" @click="leaveTeam(team.id)" />
                          <span
                            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                          >
                            Leave Team
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  <PageFooter />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { PageHeader } from "@/components/custom/page-header";
import { Search, Plus } from "lucide-vue-next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";
import { Pencil1Icon, TrashIcon, EyeOpenIcon, ExitIcon } from "@radix-icons/vue";

// Initialize Supabase client and user
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const teams = ref([]);
const searchQuery = ref("");

// Fetch teams on mount
const fetchTeams = async () => {
  if (!user.value) return;

  // Step 1: Fetch team memberships where the user is a member
  const { data: teamMemberships, error: membershipError } = await supabase
    .from("team_members")
    .select("team_id, role, user_id")
    .eq("user_id", user.value.id);

  if (membershipError) {
    console.error("Error fetching team memberships:", membershipError);
    return;
  }

  const teamIds = teamMemberships.map((membership) => membership.team_id);

  // Step 2: Fetch team details for the teams the user is in
  const { data: teamDetails, error: teamError } = await supabase
    .from("teams")
    .select("id, team_name, created_at, creator_user_id")
    .in("id", teamIds);

  if (teamError) {
    console.error("Error fetching team details:", teamError);
    return;
  }

  // Step 3: Fetch the number of members for each team
  const teamMemberCounts = await Promise.all(
    teamIds.map(async (teamId) => {
      const { count, error: countError } = await supabase
        .from("team_members")
        .select("*", { count: "exact" })
        .eq("team_id", teamId);

      if (countError) {
        console.error(`Error fetching member count for team ${teamId}:`, countError);
        return 0;
      }
      return count;
    })
  );

  // Step 4: Fetch creator names from participants
  const creatorIds = teamDetails.map((team) => team.creator_user_id);
  const { data: creators, error: creatorsError } = await supabase
    .from("participants")
    .select("user_id, name")
    .in("user_id", creatorIds);

  if (creatorsError) {
    console.error("Error fetching creator names:", creatorsError);
    return;
  }

  // Map creator names to user IDs for easy lookup
  const creatorNames = {};
  creators.forEach((creator) => {
    creatorNames[creator.user_id] = creator.name;
  });

  // Combine all data into the `teams` array
  teams.value = teamDetails.map((team, index) => ({
    ...team,
    membersCount: teamMemberCounts[index],
    createdByName: creatorNames[team.creator_user_id] || "Unknown",
    role: teamMemberships.find((membership) => membership.team_id === team.id)?.role,
  }));
};

// Format date function
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Computed property for search filtering
const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams.value;
  const query = searchQuery.value.toLowerCase();
  return teams.value.filter((team) =>
    team.team_name.toLowerCase().includes(query)
  );
});

// Fetch teams when component mounts
onMounted(() => {
  fetchTeams();
});

// Actions
const manageTeam = (teamId) => {
  console.log("Manage team:", teamId);
  // Implement manage team functionality here
};

const deleteTeam = (teamId) => {
  console.log("Delete team:", teamId);
  // Implement delete team functionality here
};

const viewTeam = (teamId) => {
  console.log("View team:", teamId);
  // Implement view team functionality here
};

const leaveTeam = (teamId) => {
  console.log("Leave team:", teamId);
  // Implement leave team functionality here
};
</script>

<style scoped>
/* Tooltip styling */
.group .tooltip {
  position: absolute;
  bottom: 100%;            /* Position above the element */
  margin-bottom: 4px;      /* Space below the tooltip */
  left: 50%;               /* Center align horizontally */
  transform: translateX(-50%);
  opacity: 0;              /* Initially hidden */
  transition: opacity 0.2s;
  font-size: 0.75rem;      /* Equivalent to text-xs */
  color: white;
  background-color: #374151; /* Equivalent to bg-gray-700 */
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.group:hover .tooltip {
  opacity: 1; /* Show tooltip on hover */
}

/* Adjust spacing for table cells */
.w-1\/6 {
  width: 16.66%;
}
</style>

