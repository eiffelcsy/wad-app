<!-- TODO: Teams homepage, include create, edit and delete buttons for each team, maybe in a table -->
<template>
  <div>
    <PageHeader/>
    <div class="container h-screen">
      Teams page for {{ user }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import PageHeader from "../components/ui/page-header/PageHeader.vue";

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
</script>

<style></style>