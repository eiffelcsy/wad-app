<template>
  <div class="flex flex-col min-h-screen">
    <PageHeader />
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-semibold mb-6">Your Team</h1>
      <Tabs default-value="all" class="w-full">
        <TabsList class="w-full border-b border-gray-300">
          <TabsTrigger value="all" class="w-full py-2 text-lg font-medium">All Members</TabsTrigger>
          <TabsTrigger value="owner" class="w-full py-2 text-lg font-medium">Owner</TabsTrigger>
          <TabsTrigger value="admins" class="w-full py-2 text-lg font-medium">Admins</TabsTrigger>
          <TabsTrigger value="members" class="w-full py-2 text-lg font-medium">Members</TabsTrigger>
        </TabsList>

        <!-- All Members Tab -->
        <TabsContent value="all">
          <Card class="mt-6">
            <CardHeader class="px-6 py-4">
              <CardTitle class="text-xl font-semibold">All Members</CardTitle>
              <CardDescription class="text-gray-500">Showing all team members.</CardDescription>
            </CardHeader>
            <CardContent class="px-6 py-4">
              <Table class="w-full border border-gray-300">
                <TableHeader>
                  <TableRow class="bg-gray-100">
                    <TableHead class="py-2 px-6">Name</TableHead>
                    <TableHead class="py-2 px-6">Email</TableHead>
                    <TableHead class="py-2 px-6">Role</TableHead>
                    <TableHead class="py-2 px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="allMembers.length === 0">
                    <TableCell colspan="4" class="text-center py-4 text-gray-500">No Members Found.</TableCell>
                  </TableRow>
                  <TableRow v-for="member in allMembers" :key="member.user_id">
                    <TableCell class="py-2 px-6">{{ member.name }}</TableCell>
                    <TableCell class="py-2 px-6">{{ member.email }}</TableCell>
                    <TableCell class="py-2 px-6">{{ capitalizeRole(member.role) }}</TableCell>
                    <TableCell class="py-2 px-6">
                      <!-- Action placeholder -->
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Owner Tab -->
        <TabsContent value="owner">
          <Card class="mt-6">
            <CardHeader class="px-6 py-4">
              <CardTitle class="text-xl font-semibold">Owner</CardTitle>
              <CardDescription class="text-gray-500">Showing the team owner.</CardDescription>
            </CardHeader>
            <CardContent class="px-6 py-4">
              <Table class="w-full border border-gray-300">
                <TableHeader>
                  <TableRow class="bg-gray-100">
                    <TableHead class="py-2 px-6">Name</TableHead>
                    <TableHead class="py-2 px-6">Email</TableHead>
                    <TableHead class="py-2 px-6">Role</TableHead>
                    <TableHead class="py-2 px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="ownerMembers.length === 0">
                    <TableCell colspan="4" class="text-center py-4 text-gray-500">No Owner Found.</TableCell>
                  </TableRow>
                  <TableRow v-for="owner in ownerMembers" :key="owner.user_id">
                    <TableCell class="py-2 px-6">{{ owner.name }}</TableCell>
                    <TableCell class="py-2 px-6">{{ owner.email }}</TableCell>
                    <TableCell class="py-2 px-6">{{ capitalizeRole(owner.role) }}</TableCell>
                    <TableCell class="py-2 px-6">
                      <!-- Action placeholder -->
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Admins Tab -->
        <TabsContent value="admins">
          <Card class="mt-6">
            <CardHeader class="px-6 py-4">
              <CardTitle class="text-xl font-semibold">Admins</CardTitle>
              <CardDescription class="text-gray-500">Showing all team admins.</CardDescription>
            </CardHeader>
            <CardContent class="px-6 py-4">
              <Table class="w-full border border-gray-300">
                <TableHeader>
                  <TableRow class="bg-gray-100">
                    <TableHead class="py-2 px-6">Name</TableHead>
                    <TableHead class="py-2 px-6">Email</TableHead>
                    <TableHead class="py-2 px-6">Role</TableHead>
                    <TableHead class="py-2 px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="adminMembers.length === 0">
                    <TableCell colspan="4" class="text-center py-4 text-gray-500">No Admins Found.</TableCell>
                  </TableRow>
                  <TableRow v-for="admin in adminMembers" :key="admin.user_id">
                    <TableCell class="py-2 px-6">{{ admin.name }}</TableCell>
                    <TableCell class="py-2 px-6">{{ admin.email }}</TableCell>
                    <TableCell class="py-2 px-6">{{ capitalizeRole(admin.role) }}</TableCell>
                    <TableCell class="py-2 px-6">
                      <!-- Action placeholder -->
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Members Tab -->
        <TabsContent value="members">
          <Card class="mt-6">
            <CardHeader class="px-6 py-4">
              <CardTitle class="text-xl font-semibold">Members</CardTitle>
              <CardDescription class="text-gray-500">Showing all regular members.</CardDescription>
            </CardHeader>
            <CardContent class="px-6 py-4">
              <Table class="w-full border border-gray-300">
                <TableHeader>
                  <TableRow class="bg-gray-100">
                    <TableHead class="py-2 px-6">Name</TableHead>
                    <TableHead class="py-2 px-6">Email</TableHead>
                    <TableHead class="py-2 px-6">Role</TableHead>
                    <TableHead class="py-2 px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="memberMembers.length === 0">
                    <TableCell colspan="4" class="text-center py-4 text-gray-500">No Members Found.</TableCell>
                  </TableRow>
                  <TableRow v-for="member in memberMembers" :key="member.user_id">
                    <TableCell class="py-2 px-6">{{ member.name }}</TableCell>
                    <TableCell class="py-2 px-6">{{ member.email }}</TableCell>
                    <TableCell class="py-2 px-6">{{ capitalizeRole(member.role) }}</TableCell>
                    <TableCell class="py-2 px-6">
                      <!-- Action placeholder -->
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  <PageFooter />
</template>

<script setup>
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const supabase = useSupabaseClient();
const allMembers = ref([]);
const ownerMembers = ref([]);
const adminMembers = ref([]);
const memberMembers = ref([]);

// Get teamCode from route parameters
const route = useRoute();
const teamCode = route.params.teamId;

const user = useSupabaseUser().value;

// Function to capitalize the first letter of the role
const capitalizeRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// Function to ensure the logged-in user's name and email are stored in the team_members table
const ensureUserInTeam = async (teamId) => {
  if (user) {
    const name = user.user_metadata.name;
    const email = user.email;

    // Check if the user already exists in team_members
    const { data: existingMember, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching team member:", error.message);
      return;
    }

    if (!existingMember) {
      // Insert the user if they are not already in the team_members table
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          name: name,
          email: email,
          role: 'member', // Default role; adjust as needed
          added_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Error inserting team member:", insertError.message);
      }
    } else if (!existingMember.name || !existingMember.email) {
      // Update the user’s name and email if they are missing
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ name, email })
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error("Error updating team member:", updateError.message);
      }
    }
  }
};

// Function to fetch team members based on team code
const fetchTeamMembers = async () => {
  try {
    // Step 1: Find the team ID using the team code from the 'teams' table
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('code', teamCode)
      .single();
    if (teamError || !teamData) {
      console.error('Error fetching team:', teamError);
      return;
    }

    const teamId = teamData.id;

    // Ensure the logged-in user's display name and email are saved in the team_members table
    await ensureUserInTeam(teamId);

    // Step 2: Fetch team members from the 'team_members' table using the team ID
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('user_id, name, email, role')
      .eq('team_id', teamId);
    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return;
    }

    // Step 3: Map the fetched data to relevant member roles
    allMembers.value = teamMembers;

    // Filter users into different role-based arrays
    ownerMembers.value = teamMembers.filter((member) => member.role === 'owner');
    adminMembers.value = teamMembers.filter((member) => member.role === 'admin');
    memberMembers.value = teamMembers.filter((member) => member.role === 'member');
  } catch (error) {
    console.error('Unexpected error fetching team members:', error);
  }
};

// Fetch team members on component mount
onMounted(() => {
  fetchTeamMembers();
});
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}
</style>
