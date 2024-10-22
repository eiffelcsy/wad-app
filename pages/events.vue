<!-- TODO: Events homepage, include create, edit and delete buttons for each event , maybe in a table -->
<template>
  <div>
    <PageHeader />
    <div class="bg-zinc-50 dark:bg-black">
      <div class="container w-full pt-8 md:pt-10 lg:pt-14">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-semibold">
          Your Events
        </h1>
      </div>
      <div class="container w-full flex flex-row justify-between pt-8">
        <div class="relative w-full max-h-10 pr-2 items-center">
          <Input
            id="searchEvents"
            type="text"
            placeholder="Search Events..."
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
              <div class="mx-auto mt-4 mb-8 w-full max-w-sm">
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
                    <Label for="SortByActivity" class="text-base font-normal"
                      >Sort by Activity</Label
                    >
                  </div>
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="SortByName"
                      value="SortByName"
                      @click="closeDrawer"
                    />
                    <Label for="SortByName" class="text-base font-normal"
                      >Sort by Name</Label
                    >
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
          @click="navigateTo('/create-event')"
          v-if="isMobile"
          size="icon"
          class="min-w-[40px] text-zinc-100 dark:text-zinc-900"
        >
          <Plus class="size-4" />
        </Button>
        <Button
          @click="navigateTo('/create-event')"
          v-else
          class="text-zinc-100 dark:text-zinc-900"
        >
          New Event<Plus class="size-4 ml-2" />
        </Button>
      </div>
      <div class="min-h-screen">
        <div
          class="container w-full grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-3 justify-center"
        >
          <Card
            v-for="(project, index) in projects"
            :key="index"
            class="mt-6 hover:border-zinc-700"
          >
            <NuxtLink
              :to="{
                name: 'project-projectId',
                params: { projectId: project.id },
              }"
            >
              <CardHeader class="gap-2">
                <CardTitle>
                  <div>
                    <h1 class="text-xl hover:underline">{{ project.title }}</h1>
                    <p class="text-base font-light text-zinc-500 mt-1">
                      {{ project.id }}
                    </p>
                  </div>
                </CardTitle>
                <CardDescription
                  ><Badge class="mt-2">{{ project.team_name }}</Badge
                  ><br
                /></CardDescription>
              </CardHeader>
              <CardContent>
                <p>{{ project.description }}</p>
              </CardContent>
            </NuxtLink>
          </Card>
        </div>
      </div>
    </div>
  </div>
  <PageFooter />
</template>

<script setup>
import { PageFooter } from "@/components/custom/page-footer";
import { PageHeader } from "@/components/custom/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
</script>
