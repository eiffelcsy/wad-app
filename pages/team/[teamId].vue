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

// Supabase setup
const supabase = useSupabaseClient();
const allMembers = ref([]);
const ownerMembers = ref([]);
const adminMembers = ref([]);
const memberMembers = ref([]);

// Get teamCode from route parameters
const route = useRoute();
const teamCode = route.params.teamId;

// Function to capitalize the first letter of the role
const capitalizeRole = (role) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
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

    // Step 2: Fetch team members from the 'team_members' table using the team ID
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('user_id, role')
      .eq('team_id', teamId);
    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return;
    }

    // Step 3: Fetch user details from the 'participants' table using user IDs
    const userIds = teamMembers.map((member) => member.user_id);
    const { data: users, error: usersError } = await supabase
      .from('participants')
      .select('user_id, name, email')
      .in('user_id', userIds);
    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return;
    }

    // Step 4: Map user details with their roles
    allMembers.value = teamMembers.map((member) => {
      const user = users.find((user) => user.user_id === member.user_id);
      return {
        user_id: member.user_id,
        name: user ? user.name : 'Unknown',
        email: user ? user.email : 'N/A',
        role: member.role,
      };
    });

    // Filter users into different role-based arrays
    ownerMembers.value = allMembers.value.filter((member) => member.role === 'owner');
    adminMembers.value = allMembers.value.filter((member) => member.role === 'admin');
    memberMembers.value = allMembers.value.filter((member) => member.role === 'member');
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
