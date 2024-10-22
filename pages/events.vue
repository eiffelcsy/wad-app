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
                </span> 
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div class="mx-auto mt-4 mb-8 w-full max-w-sm">
                <RadioGroup
                  v-model="selectedSortOption"
                  class="flex flex-col gap-4"
                >
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="sortByDate"
                      value="sortByDate"
                      @click="closeDrawer"
                    />
                    <Label for="sortByDate" class="text-base font-normal"
                      >Sort by Date</Label
                    >
                  </div>
                  <div class="flex items-center space-x-4">
                    <RadioGroupItem
                      id="sortByName"
                      value="sortByName"
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
        <Select v-if="!isMobile" default-value="sortByDate">
          <SelectTrigger class="max-w-36 mr-2">
            <SelectValue placeholder="Sort By..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="sortByDate">Sort By Date</SelectItem>
              <SelectItem value="sortByName">Sort By Name</SelectItem>
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
        <div class="container w-full pt-8">
          <Tabs default-value="all" class="w-full">
            <TabsList class="w-full">
              <TabsTrigger value="all" class="w-full"> All Events </TabsTrigger>
              <TabsTrigger value="past" class="w-full">
                Past Events
              </TabsTrigger>
              <TabsTrigger value="upcoming" class="w-full">
                Upcoming Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="past"> Change your password here. </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
  <PageFooter />
</template>

<script setup>
import { PageHeader } from "@/components/custom/page-header";
import { Ellipsis, Plus, Search } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "@vueuse/core";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";

const isMobile = useMediaQuery("(max-width: 600px)");
</script>
