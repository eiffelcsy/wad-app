<!-- TODO: Events homepage, include create, edit and delete buttons for each event , maybe in a table -->
<template>
  <div>
    <PageHeader/>
    <div class="container h-screen">
      Events page for {{ user }}
    </div>
  </div>
</template>

<script setup>
import Header from '../components/ui/page-header/header.vue';
import PageHeader from '../components/ui/page-header/PageHeader.vue';

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
</script>
