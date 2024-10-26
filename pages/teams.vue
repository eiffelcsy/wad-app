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
                  <TableHead>Team Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="teams.length === 0">
                  <TableCell colspan="4" class="text-center">No Teams Found.</TableCell>
                </TableRow>
                <TableRow v-for="team in filteredTeams" :key="team.id">
                  <TableCell>{{ team.team_name }}</TableCell>
                  <TableCell>{{ team.membersCount }}</TableCell>
                  <TableCell>{{ formatDate(team.created_at) }}</TableCell>
                  <TableCell>{{ team.createdByName || 'Unknown' }}</TableCell>
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

  // Step 4: Fetch creator names, if not in participants, fetch directly from user metadata
  const creatorIds = teamDetails.map((team) => team.creator_user_id);
  const { data: creators, error: creatorsError } = await supabase
    .from("participants")
    .select("user_id, name")
    .in("user_id", creatorIds);

  if (creatorsError) {
    console.error("Error fetching creator names:", creatorsError);
    return;
  }

  const creatorNames = {}; // Map creator names to user IDs for easy lookup
  creators.forEach((creator) => {
    creatorNames[creator.user_id] = creator.name;
  });

  // Fallback for creator name if not found in `participants`
  for (const team of teamDetails) {
    if (!creatorNames[team.creator_user_id]) {
      const creatorName = await fetchDisplayName(team.creator_user_id);
      creatorNames[team.creator_user_id] = creatorName || "Unknown";
    }
  }

  // Combine all data into the `teams` array
  teams.value = teamDetails.map((team, index) => ({
    ...team,
    membersCount: teamMemberCounts[index],
    createdByName: creatorNames[team.creator_user_id] || "Unknown",
  }));
};

// Helper function to get or create participant display name
async function fetchDisplayName(userId) {
  if (!userId) return "Unknown";

  const { data: participant, error } = await supabase
    .from("participants")
    .select("name")
    .eq("user_id", userId)
    .single();

  if (participant && participant.name) {
    return participant.name;
  } else if (user.value && user.value.id === userId) {
    return user.value.user_metadata.name || "Unknown";
  } else {
    return "Unknown";
  }
}

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
</script>
