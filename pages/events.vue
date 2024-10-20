<!-- TODO: Events homepage, include create, edit and delete buttons for each event , maybe in a table -->
<template>
  <div>
    <PageHeader/>
    <div class="container h-screen">
      Events page for {{ user }}
    </div>
    <div>
      <button>Hi</button>
    </div>
  </div>
  <PageFooter/>
</template>

<script setup>
import { PageFooter } from '@/components/custom/page-footer';
import { PageHeader } from '@/components/custom/page-header';

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
</script>
