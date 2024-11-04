<template>
  <div>
    <PageHeader />
    <div class="bg-gradient-to-b from-white dark:from-black to-indigo-200/30 dark:to-indigo-900/20 min-h-screen">
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
          class="bg-indigo-600 hover:bg-indigo-700 text-white"
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
                          <EyeOpenIcon class="cursor-pointer" @click="viewTeam(team.code)" />
                          <span
                            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                          >
                            View More
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger as-child>
                            <div class="relative group">
                              <TrashIcon class="cursor-pointer text-red-500" />
                              <span
                                class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                              >
                                Delete Team
                              </span>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this team?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Once deleted, the team and all its data will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                class="bg-red-700 text-white hover:bg-red-900"
                                @click="confirmDeleteTeam(team.id)"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <!-- Member Actions -->
                      <div v-else class="flex space-x-2">
                        <div class="relative group">
                          <EyeOpenIcon class="cursor-pointer" @click="viewTeam(team.code)" />
                          <span
                            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                          >
                            View More
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger as-child>
                            <div class="relative group">
                              <ExitIcon class="cursor-pointer text-red-500" />
                              <span
                                class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-700 px-2 py-1 rounded shadow-lg"
                              >
                                Leave Team
                              </span>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to leave this team?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Once you leave, you will no longer be able to access this team unless you join again.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                class="bg-red-700 text-white hover:bg-red-900"
                                @click="confirmLeaveTeam(team.id)"
                              >
                                Leave
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { PageHeader } from "@/components/custom/page-header";
import { Search, Plus } from "lucide-vue-next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";
import { TrashIcon, EyeOpenIcon, ExitIcon } from "@radix-icons/vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const teams = ref([]);
const searchQuery = ref("");

// Fetch teams on mount
const fetchTeams = async () => {
  if (!user.value) return;

  const { data: teamMemberships, error: membershipError } = await supabase
    .from("team_members")
    .select("team_id, role, user_id")
    .eq("user_id", user.value.id);

  if (membershipError) {
    console.error("Error fetching team memberships:", membershipError);
    return;
  }

  const teamIds = teamMemberships.map((membership) => membership.team_id);

  const { data: teamDetails, error: teamError } = await supabase
    .from("teams")
    .select("id, team_name, created_at, creator_user_id, code")
    .in("id", teamIds);

  if (teamError) {
    console.error("Error fetching team details:", teamError);
    return;
  }

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

  const creatorIds = teamDetails.map((team) => team.creator_user_id);
  const { data: creators, error: creatorsError } = await supabase
    .from("participants")
    .select("user_id, name")
    .in("user_id", creatorIds);

  if (creatorsError) {
    console.error("Error fetching creator names:", creatorsError);
    return;
  }

  const creatorNames = {};
  creators.forEach((creator) => {
    creatorNames[creator.user_id] = creator.name;
  });

  teams.value = teamDetails.map((team, index) => ({
    ...team,
    membersCount: teamMemberCounts[index],
    createdByName: creatorNames[team.creator_user_id] || "Unknown",
    role: teamMemberships.find((membership) => membership.team_id === team.id)?.role,
  }));
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams.value;
  const query = searchQuery.value.toLowerCase();
  return teams.value.filter((team) =>
    team.team_name.toLowerCase().includes(query)
  );
});

onMounted(() => {
  fetchTeams();
});

const viewTeam = (teamCode) => {
  navigateTo(`/team/${teamCode}`);
};

const confirmDeleteTeam = async (teamId) => {
  try {
    await supabase.from("team_members").delete().eq("team_id", teamId);
    await supabase.from("teams").delete().eq("id", teamId);
    fetchTeams();
  } catch (error) {
    console.error("Error deleting team:", error);
  }
};

const confirmLeaveTeam = async (teamId) => {
  try {
    await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", user.value.id);
    fetchTeams();
  } catch (error) {
    console.error("Error leaving team:", error);
  }
};
</script>

<style scoped>
/* Tooltip styling */
.group .tooltip {
  position: absolute;
  bottom: 100%;
  margin-bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 0.75rem;
  color: white;
  background-color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.group:hover .tooltip {
  opacity: 1;
}

.w-1\/6 {
  width: 16.66%;
}
</style>
