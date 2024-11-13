<template>
  <div>
    <PageHeader v-if="user" class="dark:bg-zinc-950" />
    <div
      v-else
      class="flex flex-row justify-between py-4 px-8 md:px-12 lg:px-16 bg-zinc-50 dark:bg-zinc-950 border-b"
    >
      <div class="flex flex-row items-center">
        <NuxtImg
          src="/images/logo_light.png"
          class="size-12 mr-2"
          v-if="$colorMode.value === 'light'"
        />
        <NuxtImg
          src="/images/logo_dark.png"
          class="size-12 mr-2"
          v-if="$colorMode.value === 'dark'"
        />
        <h1
          v-if="!isMobile"
          class="text-xl font-bold tracking-wider title-fade-in-left"
        >
          Meet<span class="text-indigo-600 dark:text-indigo-500">L</span>ah
        </h1>
      </div>
      <div class="flex flex-row items-center">
        <Button
          @click="toLogin"
          variant="outline"
          class="border-zinc-300 dark:border-zinc-600 login-button-animation mr-2"
        >
          <EnterIcon class="w-4 h-4 mr-2" />Login
        </Button>
        <Button
          @click="toRegister"
          class="w-28 button-fade-in-left bg-indigo-600 hover:bg-indigo-700 start-button-animation text-white"
        >
          Get Started
        </Button>
      </div>
    </div>
    <div class="min-h-screen bg-zinc-50 dark:bg-black">
      <div
        class="py-6 md:py-8 mx-auto container xl:w-[1200px] flex flex-row justify-between"
      >
        <div>
          <h1
            class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
          >
            {{ event_title }}
          </h1>
          <p class="text-base text-zinc-400 dark:text-zinc-500 mt-1">
            Event Code: <span class="font-bold">{{ event_code }}</span>
          </p>
          <p class="text-base mt-1">
            Confirmed Timeslot: <br v-if="isMobile" />
            <span class="font-bold text-indigo-500 text-lg animate-pulse">{{
              confirmedTimeslotString
            }}</span>
          </p>
        </div>
        <div class="flex flex-row items-center space-x-2">
          <EditEvent />
          <AlertDialog v-if="isCreator">
            <AlertDialogTrigger as-child>
              <Button
                class="ml-2 border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
                v-if="!isMobile"
              >
                Delete Event
              </Button>
              <Button
                size="icon"
                class="ml-2 border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
                v-if="isMobile"
              >
                <Trash2 class="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle
                  >Are you sure you want to delete this event?</AlertDialogTitle
                >
                <AlertDialogDescription>
                  This action cannot be undone. Once deleted, the event will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  class="bg-red-700 text-white hover:bg-red-900"
                  @click="confirmDelete"
                  >Delete</AlertDialogAction
                >
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog v-else>
            <AlertDialogTrigger as-child>
              <Button
                class="ml-2 border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
                v-if="!isMobile"
              >
                Leave Event
              </Button>
              <Button
                size="icon"
                class="ml-2 border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
                v-if="isMobile"
              >
                <Trash2 class="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle
                  >Are you sure you want to leave this event?</AlertDialogTitle
                >
                <AlertDialogDescription>
                  This action cannot be undone. Once you leave the event, you
                  will have to rejoin and indicate availability again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  class="bg-red-700 text-white hover:bg-red-900"
                  @click="confirmLeave"
                  >Leave</AlertDialogAction
                >
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator class="w-full" />
      <div class="py-8 mx-auto container">
        <client-only>
          <div v-if="isMobile">
            <Tabs default-value="your">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="your"> Your Availability </TabsTrigger>
                <TabsTrigger value="overall">
                  Overall Availability
                </TabsTrigger>
              </TabsList>
              <TabsContent value="your">
                <Card class="lg:w-80 xl:w-96">
                  <CardHeader>
                    <CardTitle>Your Availability</CardTitle>
                    <CardDescription
                      >Indicate blocks of time when you are
                      <span class="font-bold text-red-300 text-lg"
                        >unavailable</span
                      >. Tap to select start cell, then tap again to select end
                      cell and all the cells in between.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div class="w-full flex items-center justify-center">
                      <!-- Interval Grid -->
                      <table
                        class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                      >
                        <thead>
                          <tr>
                            <th class="pb-0.5"></th>
                            <th
                              v-for="(date, dateIndex) in dates"
                              :key="dateIndex"
                              class="text-sm font-medium pb-0.5"
                            >
                              {{ formatDate(date)[0] }} <br />
                              {{ formatDate(date)[1] }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(time, timeIndex) in times"
                            :key="timeIndex"
                          >
                            <td
                              v-if="timeIndex % 2 == 0"
                              class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                            >
                              {{ time }}
                            </td>
                            <td v-else></td>
                            <td
                              v-for="(date, dateIndex) in dates"
                              :key="dateIndex"
                              @mousedown="startSelection(dateIndex, timeIndex)"
                              @mouseover="dragSelection(dateIndex, timeIndex)"
                              @mouseup="endSelection"
                              @touchstart.prevent="
                                tapSelection(dateIndex, timeIndex)
                              "
                              class="h-6 p-0 text-center interval-cell"
                            >
                              <div
                                :class="[
                                  'h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950',
                                  isSelected(dateIndex, timeIndex)
                                    ? getMergedClass(dateIndex, timeIndex) +
                                      ' selected merged'
                                    : 'rounded-lg',
                                ]"
                              ></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="overall">
                <Card class="lg:w-80 xl:w-96">
                  <CardHeader>
                    <CardTitle>Overall Availability</CardTitle>
                    <CardDescription
                      >View the
                      <span class="font-bold text-green-400 text-lg"
                        >availability</span
                      >
                      of everyone in the event. Find a timeslot that suits
                      everyone's schedule.</CardDescription
                    >
                  </CardHeader>
                  <CardContent>
                    <TooltipProvider :delayDuration="200">
                      <div class="w-full flex items-center justify-center">
                        <!-- Heatmap Grid -->
                        <table
                          class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                        >
                          <thead>
                            <tr>
                              <th class="pb-0.5"></th>
                              <th
                                v-for="(date, dateIndex) in dates"
                                :key="dateIndex"
                                class="text-sm font-medium pb-0.5"
                              >
                                {{ formatDate(date)[0] }} <br />
                                {{ formatDate(date)[1] }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(time, timeIndex) in times"
                              :key="timeIndex"
                            >
                              <td
                                v-if="timeIndex % 2 == 0"
                                class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                              >
                                {{ time }}
                              </td>
                              <td v-else></td>
                              <td
                                v-for="(date, dateIndex) in dates"
                                :key="dateIndex"
                                class="h-6 p-0 text-center heatmap-cell"
                              >
                                <Tooltip>
                                  <TooltipTrigger as-child>
                                    <div
                                      class="h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-xs rounded-md"
                                      :style="{
                                        backgroundColor: getHeatmapColor(
                                          dateIndex,
                                          timeIndex
                                        ),
                                      }"
                                    >
                                      {{
                                        getAvailabilityCount(
                                          dateIndex,
                                          timeIndex
                                        )
                                      }}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {{
                                        getAvailableParticipantNames(
                                          dateIndex,
                                          timeIndex
                                        ).join(", ") || "No one available"
                                      }}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div class="flex flex-col gap-8 mt-8">
              <Card class="lg:w-80 xl:w-96 h-fit">
                <CardHeader>
                  <CardTitle>Recommended Timeslots</CardTitle>
                  <CardDescription
                    >Below are the top 10 timeslots with the highest
                    <span class="font-bold text-green-400">availability</span>
                    among everyone.</CardDescription
                  >
                </CardHeader>
                <CardContent>
                  <ScrollArea class="h-72">
                    <div class="w-full flex items-center justify-center">
                      <ol>
                        <li
                          v-for="{
                            date,
                            startTime,
                            endTime,
                            availability,
                          } in getRecommendedTimeBlocks()"
                          :key="timeslot"
                          class="flex items-center space-x-2 mb-2"
                        >
                          <!-- Date portion with box, slight curves, and padding -->
                          <div
                            class="border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
                          >
                            {{ formatDate(date).join(" ") }} {{ startTime }} -
                            {{ endTime }}
                          </div>
                          <!-- Availability in green, following format "[count] people available" -->
                          <span class="text-green-500 font-semibold">
                            {{ availability }} people available
                          </span>
                        </li>
                      </ol>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Dialog>
                <DialogTrigger as-child>
                  <Button size="lg" class="w-full" variant="outline"
                    >View Recommended Locations</Button
                  >
                </DialogTrigger>
                <DialogContent class="w-5/6 rounded-md">
                  <DialogHeader>
                    <DialogTitle>Location Suggestions</DialogTitle>
                    <DialogDescription
                      >Suggested meeting & eating spots for your event, based on
                      participant locations. Add your own location to see suggestions.</DialogDescription
                    >
                  </DialogHeader>
                  <GoogleMaps :eventId="event_id" />
                  <DialogFooter>
                    <DialogClose as-child>
                      <Button type="button" variant="secondary"> Close </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Card class="lg:w-80 xl:w-96 h-fit">
                <CardHeader>
                  <CardTitle>Event Polls</CardTitle>
                  <CardDescription>
                    Participate in polls related to this event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <!-- List of Polls -->
                  <div v-if="polls && polls.length">
                    <div v-for="poll in polls" :key="poll.id" class="mb-4">
                      <div class="flex flex-row justify-between">
                        <h3 class="text-lg font-semibold">
                          {{ poll.question }}
                        </h3>
                        <div v-if="canDeletePoll(poll)">
                          <Dialog>
                            <DialogTrigger as-child>
                              <Button
                                size="icon"
                                class="size-8"
                                variant="ghost"
                              >
                                <Trash2 class="size-5 text-red-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Poll</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this poll?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose as-child>
                                  <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  @click="deletePoll(poll.id)"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div v-if="!hasUserVoted(poll)">
                        <!-- Voting Options -->
                        <div
                          v-for="option in poll.poll_options"
                          :key="option.id"
                        >
                          <Button
                            @click="vote(poll.id, option.id)"
                            class="my-1"
                          >
                            {{ option.option_text }}
                          </Button>
                        </div>
                      </div>
                      <div v-else>
                        <!-- Poll Results -->
                        <div
                          v-for="option in poll.poll_options"
                          :key="option.id"
                          class="flex justify-between my-1"
                        >
                          <span>{{ option.option_text }}</span>
                          <span
                            >{{ getVoteCount(poll.id, option.id) }} votes</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p class="text-zinc-500">No polls available.</p>
                  </div>
                  <!-- Create Poll Button (only for event creator) -->
                  <div v-if="isCreator">
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button
                          class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                          >Create New Poll</Button
                        >
                      </DialogTrigger>
                      <DialogContent class="w-5/6 rounded-md">
                        <DialogHeader>
                          <DialogTitle>Create a New Poll</DialogTitle>
                          <DialogDescription
                            >Gather the opinions of your event
                            participants.</DialogDescription
                          >
                        </DialogHeader>
                        <div class="my-4">
                          <Input
                            v-model="newPollQuestion"
                            placeholder="Poll Question"
                          />
                          <div class="mt-2">
                            <div
                              v-for="(option, index) in newPollOptions"
                              :key="index"
                              class="flex items-center my-1"
                            >
                              <Input
                                v-model="newPollOptions[index]"
                                placeholder="Option Text"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                class="ml-2"
                                @click="removeOption(index)"
                                ><Minus class="size-4"
                              /></Button>
                            </div>
                            <Button
                              class="mt-2 w-full text-zinc-400"
                              variant="ghost"
                              @click="addOption"
                              ><Plus class="size-4 mr-2" /> Add Option</Button
                            >
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            @click="createPoll"
                            class="bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
                            >Create Poll</Button
                          >
                          <DialogClose as-child>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
              <Card class="lg:w-80 xl:w-96 h-fit">
                <CardHeader>
                  <div class="flex flex-row justify-between">
                    <CardTitle>Event Participants</CardTitle>
                    <CardTitle
                      >{{ event_participants.length }} /
                      {{ participants_num }}</CardTitle
                    >
                  </div>
                  <CardDescription
                    >View all participants who have joined this event
                    below.</CardDescription
                  >
                </CardHeader>
                <CardContent>
                  <ScrollArea class="h-48 mb-8">
                    <div class="w-full flex items-center justify-center">
                      <ol class="w-full">
                        <li
                          v-for="participant in event_participants"
                          :key="Object.keys(participant)[0]"
                          class="flex text-xl space-x-2 mb-2"
                        >
                          {{ Object.keys(participant)[0] }}
                        </li>
                      </ol>
                    </div>
                  </ScrollArea>
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button
                        size="lg"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >Select Finalised Timeslot</Button
                      >
                    </DialogTrigger>
                    <DialogContent class="w-5/6 rounded-md h-fit">
                      <DialogHeader>
                        <DialogTitle>Confirm Timeslot</DialogTitle>
                        <DialogDescription
                          >Tentatively lock in a timeslot and notify
                          participants who have an account with MeetLah. The
                          timeslot will also be visible on this event's main
                          page.</DialogDescription
                        >
                      </DialogHeader>
                      <ScrollArea class="h-[40rem]">
                        <TooltipProvider :delayDuration="300">
                          <table
                            class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                          >
                            <thead>
                              <tr>
                                <th class="pb-0.5"></th>
                                <th
                                  v-for="(date, dateIndex) in dates"
                                  :key="dateIndex"
                                  class="text-sm font-medium pb-0.5"
                                >
                                  {{ formatDate(date)[0] }} <br />
                                  {{ formatDate(date)[1] }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(time, timeIndex) in times"
                                :key="timeIndex"
                              >
                                <td
                                  v-if="timeIndex % 2 == 0"
                                  class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                                >
                                  {{ time }}
                                </td>
                                <td v-else></td>
                                <td
                                  v-for="(date, dateIndex) in dates"
                                  :key="dateIndex"
                                  class="h-6 p-0 text-center heatmap-cell cursor-pointer"
                                  @click="
                                    selectConfirmTimeslot(dateIndex, timeIndex)
                                  "
                                >
                                  <Tooltip>
                                    <TooltipTrigger as-child>
                                      <div
                                        class="h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-xs rounded-md transition duration-100 ease-in-out"
                                        :style="{
                                          backgroundColor: getHeatmapColor(
                                            dateIndex,
                                            timeIndex
                                          ),
                                        }"
                                        :class="[
                                          isConfirmed(dateIndex, timeIndex)
                                            ? 'bg-indigo-600 text-white' +
                                              getConfirmMergedClass(
                                                dateIndex,
                                                timeIndex
                                              )
                                            : 'rounded-md',
                                        ]"
                                      >
                                        {{
                                          getAvailabilityCount(
                                            dateIndex,
                                            timeIndex
                                          )
                                        }}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {{
                                          getAvailableParticipantNames(
                                            dateIndex,
                                            timeIndex
                                          ).join(", ") || "No one available"
                                        }}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </TooltipProvider>
                      </ScrollArea>
                      <DialogFooter>
                        <Button
                          
                          variant="outline"
                          @click="confirmSelectedTimeslot"
                          :disabled="confirmedTimeslot.length === 0"
                        >
                          Confirm Selected Timeslot
                        </Button>
                        <DialogClose as-child>
                          <Button variant="destructive">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row gap-8 justify-center" v-else>
            <Card class="lg:w-80 xl:w-96 h-fit">
              <CardHeader>
                <CardTitle>Your Availability</CardTitle>
                <CardDescription
                  >Indicate blocks of time when you are
                  <span class="font-bold text-red-300 text-lg">unavailable</span
                  >. Click and drag to select blocks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="w-full flex items-center justify-center">
                  <!-- Interval Grid -->
                  <table
                    class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                  >
                    <thead>
                      <tr>
                        <th class="pb-0.5"></th>
                        <th
                          v-for="(date, dateIndex) in dates"
                          :key="dateIndex"
                          class="text-sm font-medium pb-0.5"
                        >
                          {{ formatDate(date)[0] }} <br />
                          {{ formatDate(date)[1] }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                        <td
                          v-if="timeIndex % 2 == 0"
                          class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                        >
                          {{ time }}
                        </td>
                        <td v-else></td>
                        <td
                          v-for="(date, dateIndex) in dates"
                          :key="dateIndex"
                          @mousedown="startSelection(dateIndex, timeIndex)"
                          @mouseover="dragSelection(dateIndex, timeIndex)"
                          @mouseup="endSelection"
                          @touchstart.prevent="
                            tapSelection(dateIndex, timeIndex)
                          "
                          class="h-6 p-0 text-center interval-cell"
                        >
                          <div
                            :class="[
                              'h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out',
                              isSelected(dateIndex, timeIndex)
                                ? getMergedClass(dateIndex, timeIndex) +
                                  ' selected merged'
                                : 'rounded-lg',
                            ]"
                          ></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card class="lg:w-80 xl:w-96 h-fit">
              <CardHeader>
                <CardTitle>Overall Availability</CardTitle>
                <CardDescription
                  >View the
                  <span class="font-bold text-green-400 text-lg"
                    >availability</span
                  >
                  of everyone in the event. <br />
                  Find a timeslot that suits everyone's
                  schedule.</CardDescription
                >
              </CardHeader>
              <CardContent>
                <TooltipProvider :delayDuration="200">
                  <div class="w-full flex items-center justify-center">
                    <!-- Heatmap Grid -->
                    <table
                      class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                    >
                      <thead>
                        <tr>
                          <th class="pb-0.5"></th>
                          <th
                            v-for="(date, dateIndex) in dates"
                            :key="dateIndex"
                            class="text-sm font-medium pb-0.5"
                          >
                            {{ formatDate(date)[0] }} <br />
                            {{ formatDate(date)[1] }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(time, timeIndex) in times" :key="timeIndex">
                          <td
                            v-if="timeIndex % 2 == 0"
                            class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                          >
                            {{ time }}
                          </td>
                          <td v-else></td>
                          <td
                            v-for="(date, dateIndex) in dates"
                            :key="dateIndex"
                            class="h-6 p-0 text-center heatmap-cell"
                          >
                            <Tooltip>
                              <TooltipTrigger as-child>
                                <div
                                  class="h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-xs rounded-md transition-all duration-500 ease-in-out"
                                  :style="{
                                    backgroundColor: getHeatmapColor(
                                      dateIndex,
                                      timeIndex
                                    ),
                                  }"
                                >
                                  {{
                                    getAvailabilityCount(dateIndex, timeIndex)
                                  }}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {{
                                    getAvailableParticipantNames(
                                      dateIndex,
                                      timeIndex
                                    ).join(", ") || "No one available"
                                  }}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
            <div class="flex flex-col gap-4">
              <Card class="lg:w-80 xl:w-96 h-fit">
                <CardHeader>
                  <CardTitle>Recommended Timeslots</CardTitle>
                  <CardDescription
                    >Below are the top 10 timeslots with the highest
                    <span class="font-bold text-green-400">availability</span>
                    among everyone.</CardDescription
                  >
                </CardHeader>
                <CardContent>
                  <ScrollArea class="h-72">
                    <div class="w-full flex items-center justify-center">
                      <ol>
                        <li
                          v-for="{
                            date,
                            startTime,
                            endTime,
                            availability,
                          } in getRecommendedTimeBlocks()"
                          :key="timeslot"
                          class="flex items-center space-x-2 mb-2"
                        >
                          <!-- Date portion with box, slight curves, and padding -->
                          <div
                            class="border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
                          >
                            {{ formatDate(date).join(" ") }} 
                            <p>{{ startTime }} - {{ endTime }}</p>
                          </div>
                          <!-- Availability in green, following format "[count] people available" -->
                          <span class="text-green-500 font-semibold">
                            {{ availability }} people available
                          </span>
                        </li>
                      </ol>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Dialog>
                <DialogTrigger as-child>
                  <Button size="lg" class="w-full" variant="outline"
                    >View Recommended Locations</Button
                  >
                </DialogTrigger>
                <DialogContent class="w-5/6 rounded-md">
                  <DialogHeader>
                    <DialogTitle>Location Suggestions</DialogTitle>
                    <DialogDescription
                      >Suggested meeting & eating spots for your event, based on
                      participant locations.</DialogDescription
                    >
                  </DialogHeader>
                  <GoogleMaps :eventId=event_id />
                  <DialogFooter>
                    <DialogClose as-child>
                      <Button type="button" variant="secondary"> Close </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Card class="lg:w-80 xl:w-96 h-fit">
                <CardHeader>
                  <CardTitle>Event Polls</CardTitle>
                  <CardDescription>
                    Participate in polls related to this event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <!-- List of Polls -->
                  <div v-if="polls && polls.length">
                    <div v-for="poll in polls" :key="poll.id" class="mb-4">
                      <div class="flex flex-row justify-between">
                        <h3 class="text-lg font-semibold">
                          {{ poll.question }}
                        </h3>
                        <div v-if="canDeletePoll(poll)">
                          <Dialog>
                            <DialogTrigger as-child>
                              <Button
                                size="icon"
                                class="size-8"
                                variant="ghost"
                              >
                                <Trash2 class="size-5 text-red-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Poll</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this poll?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose as-child>
                                  <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  @click="deletePoll(poll.id)"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div v-if="!hasUserVoted(poll)">
                        <!-- Voting Options -->
                        <div
                          v-for="option in poll.poll_options"
                          :key="option.id"
                        >
                          <Button
                            @click="vote(poll.id, option.id)"
                            class="my-1"
                          >
                            {{ option.option_text }}
                          </Button>
                        </div>
                      </div>
                      <div v-else>
                        <!-- Poll Results -->
                        <div
                          v-for="option in poll.poll_options"
                          :key="option.id"
                          class="flex justify-between my-1"
                        >
                          <span>{{ option.option_text }}</span>
                          <span
                            >{{ getVoteCount(poll.id, option.id) }} votes</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p class="text-zinc-500">No polls available.</p>
                  </div>
                  <!-- Create Poll Button (only for event creator) -->
                  <div v-if="isCreator">
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button
                          class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                          >Create New Poll</Button
                        >
                      </DialogTrigger>
                      <DialogContent class="w-5/6 rounded-md">
                        <DialogHeader>
                          <DialogTitle>Create a New Poll</DialogTitle>
                          <DialogDescription
                            >Gather the opinions of your event
                            participants.</DialogDescription
                          >
                        </DialogHeader>
                        <div class="my-4">
                          <Input
                            v-model="newPollQuestion"
                            placeholder="Poll Question"
                          />
                          <div class="mt-2">
                            <div
                              v-for="(option, index) in newPollOptions"
                              :key="index"
                              class="flex items-center my-1"
                            >
                              <Input
                                v-model="newPollOptions[index]"
                                placeholder="Option Text"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                class="ml-2"
                                @click="removeOption(index)"
                                ><Minus class="size-4"
                              /></Button>
                            </div>
                            <Button
                              class="mt-2 w-full text-zinc-400"
                              variant="ghost"
                              @click="addOption"
                              ><Plus class="size-4 mr-2" /> Add Option</Button
                            >
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            @click="createPoll"
                            class="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >Create Poll</Button
                          >
                          <DialogClose as-child>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div v-else>
                    <Button disabled class="w-full mt-4 text-sm">Log in as event creator to create a poll</Button>
                  </div>
                </CardContent>
              </Card>
              <Card class="lg:w-80 xl:w-96 h-fit">
                <CardHeader>
                  <div class="flex flex-row justify-between">
                    <CardTitle>Event Participants</CardTitle>
                    <CardTitle
                      >{{ event_participants.length }} /
                      {{ participants_num }}</CardTitle
                    >
                  </div>
                  <CardDescription
                    >View all participants who have joined this event
                    below.</CardDescription
                  >
                </CardHeader>
                <CardContent>
                  <ScrollArea class="h-48 mb-8">
                    <div class="w-full flex items-center justify-center">
                      <ol class="w-full">
                        <li
                          v-for="participant in event_participants"
                          :key="Object.keys(participant)[0]"
                          class="flex text-xl space-x-2 mb-2"
                        >
                          {{ Object.keys(participant)[0] }}
                        </li>
                      </ol>
                    </div>
                  </ScrollArea>
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button
                        size="lg"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >Confirm Timeslot</Button
                      >
                    </DialogTrigger>
                    <DialogContent class="w-5/6 rounded-md h-fit">
                      <DialogHeader>
                        <DialogTitle>Confirm Timeslot</DialogTitle>
                        <DialogDescription
                          >Tentatively lock in a timeslot and notify
                          participants who have an account with MeetLah. The
                          timeslot will also be visible on this event's main
                          page.</DialogDescription
                        >
                      </DialogHeader>
                      <ScrollArea class="h-[40rem]">
                        <TooltipProvider :delayDuration="200">
                          <table
                            class="w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1"
                          >
                            <thead>
                              <tr>
                                <th class="pb-0.5"></th>
                                <th
                                  v-for="(date, dateIndex) in dates"
                                  :key="dateIndex"
                                  class="text-sm font-medium pb-0.5"
                                >
                                  {{ formatDate(date).join(" ") }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(time, timeIndex) in times"
                                :key="timeIndex"
                              >
                                <td
                                  v-if="timeIndex % 2 == 0"
                                  class="w-10 border-t pl-2 pr-1 border-zinc-300 dark:border-zinc-700"
                                >
                                  {{ time }}
                                </td>
                                <td v-else></td>
                                <td
                                  v-for="(date, dateIndex) in dates"
                                  :key="dateIndex"
                                  class="h-6 p-0 text-center heatmap-cell cursor-pointer"
                                  @click="
                                    selectConfirmTimeslot(dateIndex, timeIndex)
                                  "
                                >
                                  <Tooltip>
                                    <TooltipTrigger as-child>
                                      <div
                                        class="h-full w-full flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-xs rounded-md transition duration-100 ease-in-out"
                                        :style="{
                                          backgroundColor: getHeatmapColor(
                                            dateIndex,
                                            timeIndex
                                          ),
                                        }"
                                        :class="[
                                          isConfirmed(dateIndex, timeIndex)
                                            ? 'bg-indigo-600 text-white' +
                                              getConfirmMergedClass(
                                                dateIndex,
                                                timeIndex
                                              )
                                            : 'rounded-md',
                                        ]"
                                      >
                                        {{
                                          getAvailabilityCount(
                                            dateIndex,
                                            timeIndex
                                          )
                                        }}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {{
                                          getAvailableParticipantNames(
                                            dateIndex,
                                            timeIndex
                                          ).join(", ") || "No one available"
                                        }}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </TooltipProvider>
                      </ScrollArea>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          @click="confirmSelectedTimeslot"
                          :disabled="confirmedTimeslot.length === 0"
                        >
                          Confirm Selected Timeslot
                        </Button>
                        <DialogClose as-child>
                          <Button variant="destructive" class="bg-red-600 text-white hover:bg-red-700 hover:text-white">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
          <!-- Existing Dialog and Toast Components -->
          <Dialog :open="showNameDialog">
            <DialogContent class="w-5/6 rounded-md">
              <DialogHeader>
                <DialogTitle>Enter Display Name</DialogTitle>
                <DialogDescription class="text-left">
                  Please enter your display name to continue. If you have joined
                  this event previously, enter your previous display name.<br />
                  <span v-if="!user" class="text-red-600"
                    >Remember your display name
                    <span class="font-bold">(case-sensitive)</span>, you will
                    need it to log back into this event.</span
                  >
                </DialogDescription>
              </DialogHeader>
              <Input
                v-model="newDisplayName"
                placeholder="Enter your display name"
                class="my-4"
              />

              <div class="flex justify-end">
                <Button
                  @click="saveDisplayName"
                  class="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black"
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </client-only>
      </div>
    </div>
    <Toaster />
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster } from "@/components/ui/toast";
import { navigateTo } from "nuxt/app";
import debounce from "lodash.debounce";
import { PageHeader } from "@/components/custom/page-header";
import { EnterIcon } from "@radix-icons/vue";
import { PageFooter } from "@/components/custom/page-footer";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Minus, Plus, Trash2 } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";
import { EditEvent } from "@/components/custom/edit-event";
import { GoogleMaps } from "@/components/custom/google-maps";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const { toast } = useToast();
const isMobile = useMediaQuery("(max-width: 1000px)");

const showNameDialog = ref(false);
const event_id = ref("");
const newDisplayName = ref("");
const displayName = ref("");
const event_title = ref("");
const event_participants = ref([]);
const participants_num = ref(0);
const participants_userIds = ref([]);
const isCreator = ref(false);

// Variables for the interval grid
const startDate = ref("");
const endDate = ref("");
const startTime = ref("");
const endTime = ref("");
const dates = ref([]);
const times = ref([]);
const intervals = ref([]);
const confirmedTimeslot = ref([]);
const confirmedTimeslotString = ref("");

// Variables for the poll
const polls = ref([]);
const userVotes = ref([]);
const newPollQuestion = ref("");
const newPollOptions = ref([""]);

// Variable to store the participant's name
const participant_name = ref(null);

const event_code = route.params.eventId;

definePageMeta({
  head: {
    meta: [
      { property: "og:title", content: "Join Event" },
      { property: "og:description", content: "You have been invited!" },
    ],
  },
});

onMounted(async () => {
  // Fetch event details from Supabase
  const { data: findEvent, error: findEventError } = await supabase
    .from("events")
    .select("*")
    .eq("code", event_code)
    .single();

  if (findEventError) {
    toast({
      title: "Invalid link.",
      description: "No event with this code is found.",
      variant: "destructive",
    });
    setTimeout(() => navigateTo("/join"), 1000);
  } else {
    event_id.value = findEvent.id;
    event_title.value = findEvent.title;
    startDate.value = findEvent.start_date;
    endDate.value = findEvent.end_date;
    startTime.value = findEvent.start_time;
    endTime.value = findEvent.end_time;
    isCreator.value = user.value
      ? findEvent.creator_user_id == user.value.id
      : false;
    participants_num.value = findEvent.number_of_participants;
    confirmedTimeslotString.value = findEvent.confirmed_timeslot
      ? findEvent.confirmed_timeslot
      : "TBC";

    // Generate intervals
    generateIntervals();

    // Fetch participants
    await fetchParticipants();

    // Fetch participant data
    await fetchParticipantData();

    // Fetch user events from api
    if (user.value) {
      const timeMin = combineDateAndTime(
        findEvent.start_date,
        findEvent.start_time
      );
      const timeMax = combineDateAndTime(
        findEvent.end_date,
        findEvent.end_time
      );
      const [gCalEvents, mCalEvents] = await Promise.all([
        fetchGoogleCalEvents(timeMin, timeMax),
        fetchMicrosoftCalEvents(timeMin, timeMax),
      ]);

      // Once the events are fetched, update availability based on the results
      if (gCalEvents && gCalEvents.length > 0) {
        await updateAvailabilityFromGoogleCal(gCalEvents);
      }

      if (mCalEvents && mCalEvents.length > 0) {
        await updateAvailabilityFromMicrosoftCal(mCalEvents);
      }
    }
  }

  await fetchPolls();
});

async function fetchPolls() {
  const { data, error } = await supabase
    .from("polls")
    .select(
      `
      *,
      poll_options(*),
      poll_votes(*)
    `
    )
    .eq("event_id", event_id.value);

  if (error) {
    console.error("Error fetching polls:", error.message);
    return;
  }

  if (data) {
    polls.value = data;
    // Fetch user votes
    userVotes.value = await getUserVotes();
  }
}

async function getUserVotes() {
  if (!user.value) return [];
  const { data, error } = await supabase
    .from("poll_votes")
    .select("*")
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Error fetching user votes:", error.message);
    return [];
  }

  return data;
}

function hasUserVoted(poll) {
  if (!user.value) return false;
  return userVotes.value.some(
    (vote) => vote.poll_id === poll.id && vote.user_id === user.value.id
  );
}

async function vote(pollId, optionId) {
  if (!user.value) {
    toast({
      title: "Not Logged In",
      description: "You must be logged in to vote.",
      variant: "destructive",
    });
    return;
  }

  // Check if user has already voted
  if (
    userVotes.value.some(
      (vote) => vote.poll_id === pollId && vote.user_id === user.value.id
    )
  ) {
    toast({
      title: "Already Voted",
      description: "You have already voted in this poll.",
      variant: "destructive",
    });
    return;
  }

  const { error } = await supabase.from("poll_votes").insert({
    poll_id: pollId,
    option_id: optionId,
    user_id: user.value.id,
  });

  if (error) {
    console.error("Error voting:", error.message);
    toast({
      title: "Error",
      description: "Failed to submit vote.",
      variant: "destructive",
    });
    return;
  }

  // Update votes
  await fetchPolls();
}

function addOption() {
  newPollOptions.value.push("");
}

function removeOption(index) {
  if (newPollOptions.value.length > 1) {
    newPollOptions.value.splice(index, 1);
  }
}

async function createPoll() {
  if (!newPollQuestion.value.trim()) {
    toast({
      title: "Invalid Input",
      description: "Poll question cannot be empty.",
      variant: "destructive",
    });
    return;
  }

  if (newPollOptions.value.some((option) => !option.trim())) {
    toast({
      title: "Invalid Input",
      description: "Poll options cannot be empty.",
      variant: "destructive",
    });
    return;
  }

  // Insert poll
  const { data: pollData, error: pollError } = await supabase
    .from("polls")
    .insert({
      event_id: event_id.value,
      question: newPollQuestion.value,
      created_by: user.value.id,
    })
    .select()
    .single();

  if (pollError) {
    console.error("Error creating poll:", pollError.message);
    toast({
      title: "Error",
      description: "Failed to create poll.",
      variant: "destructive",
    });
    return;
  }

  // Insert options
  const optionsData = newPollOptions.value.map((optionText) => ({
    poll_id: pollData.id,
    option_text: optionText,
  }));

  const { error: optionsError } = await supabase
    .from("poll_options")
    .insert(optionsData);

  if (optionsError) {
    console.error("Error inserting options:", optionsError.message);
    toast({
      title: "Error",
      description: "Failed to create poll options.",
      variant: "destructive",
    });
    return;
  }

  // Reset form
  newPollQuestion.value = "";
  newPollOptions.value = [""];

  // Fetch polls again
  await fetchPolls();
}

function getVoteCount(pollId, optionId) {
  const poll = polls.value.find((p) => p.id === pollId);
  if (!poll) return 0;
  return poll.poll_votes.filter((vote) => vote.option_id === optionId).length;
}

async function deletePoll(pollId) {
  // Close the dialog (if using a reactive variable to control the dialog state)
  // showDeletePollDialog.value = false;

  // Delete the poll from Supabase
  const { error } = await supabase.from("polls").delete().eq("id", pollId);

  if (error) {
    console.error("Error deleting poll:", error.message);
    toast({
      title: "Error",
      description: "Failed to delete the poll.",
      variant: "destructive",
    });
    return;
  }

  // Refresh the polls list
  await fetchPolls();

  toast({
    title: "Poll Deleted",
    description: "The poll has been successfully deleted.",
    variant: "success",
  });
}

function canDeletePoll(poll) {
  if (!user.value) return false;

  // Allow if the user is the event creator or the poll creator
  return isCreator.value || poll.created_by === user.value.id;
}

async function fetchParticipants() {
  const { data: findParticipants, error } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", event_id.value);

  if (error) {
    console.error("Error fetching participants:", error.message);
    return;
  }

  if (findParticipants) {
    event_participants.value = findParticipants.map(
      ({ name, availability }) => ({ [name]: availability })
    );
    participants_userIds.value = findParticipants.map(({ user_id }) => user_id);
  }
}

async function fetchParticipantData() {
  const participant = await getOrCreateParticipant();

  if (participant) {
    setParticipantData(participant);
    await fetchParticipants();
  }
}

async function getOrCreateParticipant() {
  let name = "";

  if (user.value) {
    name = user.value.user_metadata.name;
    const participant = await ensureParticipant(
      name,
      user.value.id,
      user.value.email
    );
    return participant;
  } else {
    if (!newDisplayName.value) {
      showNameDialog.value = true;
      return null;
    }

    name = newDisplayName.value;
    const participant = await ensureParticipant(name);
    return participant;
  }
}

async function ensureParticipant(name, user_id = null, email = null) {
  let participant = null;

  // Try to fetch participant by user_id if provided
  if (user_id) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", event_id.value)
      .eq("user_id", user_id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching participant by user_id:", error.message);
      return null;
    }

    participant = data;
  }

  // If not found by user_id, or user_id not provided, try fetching by name
  if (!participant) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", event_id.value)
      .eq("name", name)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching participant by name:", error.message);
      return null;
    }

    participant = data;
  }

  // If participant does not exist, create one
  if (!participant) {
    const { data: newParticipant, error: insertError } = await supabase
      .from("participants")
      .insert({
        event_id: event_id.value,
        name: name,
        user_id: user_id,
        email: email,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error creating participant:", insertError.message);
      return null;
    }

    participant = newParticipant;
  }

  return participant;
}

async function fetchGoogleCalEvents(timeMin, timeMax) {
  const { data: isImported, error: isImportedError } = await supabase
    .from("participants")
    .select("gcal_imported")
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (isImportedError) {
    console.log(isImportedError.message);
  } else {
    if (user && !isImported.gcal_imported) {
      try {
        const response = await fetch(
          `/api/calendar/gEvents?timeMin=${timeMin}&timeMax=${timeMax}`
        );
        return response.json();
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    } else {
      return null;
    }
  }
}

async function updateAvailabilityFromGoogleCal(events) {
  events.forEach((event) => {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    intervals.value.forEach((interval, index) => {
      const intervalStart = new Date(interval.date + "T" + interval.time);
      const intervalEnd = new Date(intervalStart.getTime() + 30 * 60000);

      const isOverlapping =
        eventStart < intervalEnd && eventEnd > intervalStart;

      if (isOverlapping) {
        intervals.value[index].selected = true;
      }
    });
  });

  await saveAvailability();
  const { error: importError } = await supabase
    .from("participants")
    .update({ gcal_imported: "true" })
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (importError) {
    console.log(importError.message);
  }
}

// Function to fetch Microsoft Calendar events based on time range
async function fetchMicrosoftCalEvents(timeMin, timeMax) {
  // Check if Microsoft Calendar events have already been imported
  const { data: isImported, error: isImportedError } = await supabase
    .from("participants")
    .select("mcal_imported")
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (isImportedError) {
    console.log(isImportedError.message);
  } else {
    if (user && !isImported.mcal_imported) {
      try {
        const response = await fetch(
          `/api/calendar/mEvents?timeMin=${timeMin}&timeMax=${timeMax}`
        );
        return response.json();
      } catch (err) {
        console.error("Error fetching Microsoft Calendar events:", err.message);
      }
    } else {
      return null;
    }
  }
}

// Function to update availability based on fetched Microsoft Calendar events
async function updateAvailabilityFromMicrosoftCal(events) {
  events.forEach((event) => {
    const eventStart = new Date(`${event.start.dateTime}Z`);
    const eventEnd = new Date(`${event.end.dateTime}Z`);

    intervals.value.forEach((interval, index) => {
      const intervalStart = new Date(interval.date + "T" + interval.time);
      const intervalEnd = new Date(intervalStart.getTime() + 30 * 60000);

      const isOverlapping =
        eventStart < intervalEnd && eventEnd > intervalStart;

      if (isOverlapping) {
        intervals.value[index].selected = true;
      }
    });
  });

  // Save the updated availability intervals
  await saveAvailability();

  // Mark Microsoft Calendar events as imported in the database
  const { error: importError } = await supabase
    .from("participants")
    .update({ mcal_imported: "true" })
    .eq("event_id", event_id.value)
    .eq("user_id", user.value.id)
    .single();

  if (importError) {
    console.log(importError.message);
  }
}

function combineDateAndTime(startDate, startTime) {
  const datePart = new Date(startDate);
  const timeParts = startTime.split(":");

  datePart.setHours(timeParts[0], timeParts[1], timeParts[2] || 0);

  return datePart.toISOString();
}

function setParticipantData(participant) {
  displayName.value = participant.name;
  participant_name.value = participant.name;
  showNameDialog.value = false;

  loadAvailability(participant.availability);
}

const saveDisplayName = async () => {
  if (newDisplayName.value) {
    const participant = await ensureParticipant(newDisplayName.value);

    if (participant) {
      setParticipantData(participant);
      await fetchParticipants();
    }
  }
};

// Interval Grid Methods
function formatDate(date) {
  const options = {
    weekday: "short",
    year: "2-digit",
    month: "short",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString(undefined, options).split(", ");
}

function generateIntervals() {
  // Parse dates
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  // Generate date array
  dates.value = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.value.push(new Date(currentDate).toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Parse times
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const startTimeMinutes = parseTime(startTime.value);
  const endTimeMinutes = parseTime(endTime.value);

  // Generate time array
  times.value = [];
  let currentMinutes = startTimeMinutes;
  while (currentMinutes < endTimeMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    times.value.push(("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2));
    currentMinutes += 30;
  }

  // Generate intervals
  intervals.value = [];
  for (let date of dates.value) {
    for (let time of times.value) {
      intervals.value.push({
        date,
        time,
        selected: false,
      });
    }
  }
}

function toggleInterval(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  intervals.value[intervalIndex].selected =
    !intervals.value[intervalIndex].selected;

  // Save availability after toggling an interval
  debouncedSaveAvailability();
}

function isSelected(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return intervals.value[intervalIndex].selected;
}

const bitString = computed(() => {
  return intervals.value
    .map((interval) => (interval.selected ? "0" : "1"))
    .join("");
});

// Function to save availability to Supabase (debounced)
const saveAvailability = async () => {
  if (!participant_name.value) {
    toast({
      title: "Error",
      description: "Participant not identified.",
      variant: "destructive",
    });
    return;
  }

  const { error } = await supabase
    .from("participants")
    .update({ availability: bitString.value })
    .eq("event_id", event_id.value)
    .eq("name", participant_name.value);

  if (error) {
    console.error("Error updating availability:", error.message);
    toast({
      title: "Error",
      description: "Failed to save availability.",
      variant: "destructive",
    });
  } else {
    // Refresh participants list to update heatmap
    await fetchParticipants();
  }
};

// Debounced version of saveAvailability
const debouncedSaveAvailability = debounce(saveAvailability, 500);

// Function to load existing availability into intervals
function loadAvailability(availabilityString) {
  if (
    !availabilityString ||
    availabilityString.length !== intervals.value.length
  ) {
    // Initialize to ones if availabilityString is null or length mismatch
    availabilityString = "1".repeat(intervals.value.length);
  }

  availabilityString.split("").forEach((char, index) => {
    intervals.value[index].selected = char === "0";
  });
}

// Computed property to calculate availability counts for the heatmap
const availabilityCounts = computed(() => {
  if (!intervals.value.length) return [];
  const counts = Array(intervals.value.length).fill(0);
  event_participants.value.forEach((participant) => {
    const name = Object.keys(participant)[0];
    const availabilityString = participant[name];
    if (
      availabilityString &&
      availabilityString.length === intervals.value.length
    ) {
      for (let i = 0; i < availabilityString.length; i++) {
        if (availabilityString[i] === "1") {
          counts[i]++;
        }
      }
    }
  });
  return counts;
});

// Function to get the heatmap color for a cell
function getHeatmapColor(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  const count = availabilityCounts.value[intervalIndex] || 0;
  const totalParticipants = event_participants.value.length || 1; // Prevent division by zero
  const opacity = count / totalParticipants;
  return `rgba(34, 197, 94, ${opacity})`; // Adjust the color as needed
}

// Function to get the availability count for a cell
function getAvailabilityCount(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return availabilityCounts.value[intervalIndex] || 0;
}

function getRecommendedTimeBlocks() {
  const minBlockLength = 2;
  const recommendedBlocks = [];

  dates.value.forEach((date, dateIndex) => {
    let start = null;
    let blockCount = 0;
    let blockScore = 0;

    times.value.forEach((time, timeIndex) => {
      const intervalIndex = dateIndex * times.value.length + timeIndex;
      const availability = availabilityCounts.value[intervalIndex] || 0;

      if (availability > 0) {
        if (start === null) start = timeIndex;
        blockCount++;
        blockScore += availability;

        if (blockCount >= minBlockLength) {
          const end = timeIndex;
          const startTime = times.value[start];

          let endTime;
          if (end + 1 < times.value.length) {
            endTime = times.value[end + 1];
          } else {
            const [hour, minute] = times.value[end].split(":").map(Number);
            const newMinute = (minute + 30) % 60;
            const newHour = hour + Math.floor((minute + 30) / 60);
            endTime = `${String(newHour).padStart(2, "0")}:${String(
              newMinute
            ).padStart(2, "0")}`;
          }

          recommendedBlocks.push({
            date,
            startTime,
            endTime,
            score: blockScore,
            availability,
          });

          start = null;
          blockCount = 0;
          blockScore = 0;
        }
      } else {
        start = null;
        blockCount = 0;
        blockScore = 0;
      }
    });
  });

  // Sort the blocks by score (higher scores first) and return the top results
  recommendedBlocks.sort((a, b) => b.score - a.score);
  return recommendedBlocks.slice(0, 10); // Limit to top 10 blocks
}

const isDragging = ref(false); // Track if dragging is active
const selectionMode = ref(true); // Track if we're selecting or deselecting
const startCell = ref(null); // Track the start cell for tap selection
const endCell = ref(null); // Track the end cell for tap selection

// Function to start selecting (both for drag and tap)
function startSelection(dateIndex, timeIndex) {
  isDragging.value = true;
  const isAlreadySelected = isSelected(dateIndex, timeIndex);
  selectionMode.value = !isAlreadySelected; // Toggle the mode based on the initial cell's state
  toggleInterval(dateIndex, timeIndex);
  startCell.value = { dateIndex, timeIndex }; // Store the start cell for tap selection
}

// Function to end the selection process (for drag selection)
function endSelection() {
  isDragging.value = false;
  startCell.value = null; // Reset start cell after dragging or tap selection is complete
  endCell.value = null; // Reset end cell
  // Trigger save logic if needed (e.g., debouncedSaveAvailability())
}

// Function to handle dragging over cells
function dragSelection(dateIndex, timeIndex) {
  if (isDragging.value) {
    // Only toggle the cell if it hasn't already been toggled in the current drag operation
    if (isSelected(dateIndex, timeIndex) !== selectionMode.value) {
      toggleInterval(dateIndex, timeIndex);
    }
  }
}

// Function to handle tap selection start and end (for touch devices)
function tapSelection(dateIndex, timeIndex) {
  if (!startCell.value) {
    // If there's no start cell yet, set this as the start cell
    startSelection(dateIndex, timeIndex);
  } else {
    // This is the end tap, so perform the selection for all cells between start and end
    endCell.value = { dateIndex, timeIndex };
    selectCellsInRange(startCell.value, endCell.value);
    endSelection(); // Finalize the selection process
  }
}

// Function to select all cells between the start and end points
function selectCellsInRange(start, end) {
  const [startDateIndex, endDateIndex] = [
    Math.min(start.dateIndex, end.dateIndex),
    Math.max(start.dateIndex, end.dateIndex),
  ];
  const [startTimeIndex, endTimeIndex] = [
    Math.min(start.timeIndex, end.timeIndex),
    Math.max(start.timeIndex, end.timeIndex),
  ];

  for (let i = startDateIndex; i <= endDateIndex; i++) {
    for (let j = startTimeIndex; j <= endTimeIndex; j++) {
      if (isSelected(i, j) !== selectionMode.value) {
        toggleInterval(i, j);
      }
    }
  }
}

function getMergedClass(dateIndex, timeIndex) {
  const hasAbove = timeIndex > 0 && isSelected(dateIndex, timeIndex - 1);
  const hasBelow =
    timeIndex < times.value.length - 1 && isSelected(dateIndex, timeIndex + 1);

  let classes = "";

  // Handle top and bottom corners only
  if (!hasAbove) {
    classes += " rounded-t-lg"; // Rounded top if no selected cell above
  }
  if (!hasBelow) {
    classes += " rounded-b-lg"; // Rounded bottom if no selected cell below
  }

  return classes.trim();
}

async function deleteEventFromDB(eventId) {
  try {
    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      throw error;
    }
    return true;
  } catch (err) {
    console.error("Error deleting event:", err.message);
    return false;
  }
}

async function confirmDelete() {
  const success = await deleteEventFromDB(event_id.value);
  if (success) {
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
      variant: "success",
      duration: 1000,
    });
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
  } else {
    toast({
      title: "Deletion Failed",
      description: "There was an error deleting the event.",
      variant: "destructive",
      duration: 1000,
    });
  }
}

async function leaveEvent(userName, eventId) {
  try {
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("event_id", eventId)
      .eq("name", userName);

    if (error) {
      throw error;
    }
    return true;
  } catch (err) {
    console.error("Error deleting event:", err.message);
    return false;
  }
}

async function confirmLeave() {
  const success = await leaveEvent(displayName.value, event_id.value);
  if (success) {
    toast({
      title: "Event Left",
      description: "You have successfully left this event.",
      variant: "success",
      duration: 1000,
    });
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
  } else {
    toast({
      title: "Leave Event Failed",
      description: "There was an error leaving the event.",
      variant: "destructive",
      duration: 1000,
    });
  }
}

function getAvailableParticipantNames(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  const names = [];

  event_participants.value.forEach((participant) => {
    const name = Object.keys(participant)[0];
    const availabilityString = participant[name];
    if (availabilityString && availabilityString.length > intervalIndex) {
      if (availabilityString[intervalIndex] === "1") {
        names.push(name);
      }
    }
  });

  return names;
}

function isConfirmed(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;
  return confirmedTimeslot.value.includes(intervalIndex);
}

function selectConfirmTimeslot(dateIndex, timeIndex) {
  const intervalIndex = dateIndex * times.value.length + timeIndex;

  // If confirmedTimeslot is empty, start new selection
  if (confirmedTimeslot.value.length === 0) {
    confirmedTimeslot.value.push(intervalIndex);
  } else {
    const selectedIndices = confirmedTimeslot.value;
    const selectedDateIndex = Math.floor(
      selectedIndices[0] / times.value.length
    );

    // Ensure same date
    if (dateIndex !== selectedDateIndex) {
      // Reset selection to new date
      confirmedTimeslot.value = [intervalIndex];
      return;
    }

    // Check if the new interval is adjacent to current selection
    const minIndex = Math.min(...selectedIndices);
    const maxIndex = Math.max(...selectedIndices);

    if (intervalIndex === minIndex - 1 || intervalIndex === maxIndex + 1) {
      // Adjacent, add to selection
      confirmedTimeslot.value.push(intervalIndex);
      confirmedTimeslot.value.sort((a, b) => a - b);
    } else {
      // Not adjacent or gap detected, reset selection
      confirmedTimeslot.value = [intervalIndex];
    }
  }
}

async function confirmSelectedTimeslot() {
  if (confirmedTimeslot.value.length === 0) {
    toast({
      title: "No Timeslot Selected",
      description: "Please select a timeslot to confirm.",
      variant: "destructive",
    });
    return;
  }

  const intervalsSelected = confirmedTimeslot.value.map(
    (index) => intervals.value[index]
  );

  const firstInterval = intervalsSelected[0];
  const lastInterval = intervalsSelected[intervalsSelected.length - 1];

  // Calculate the timeIndex of the last interval
  const lastIntervalIndex =
    confirmedTimeslot.value[confirmedTimeslot.value.length - 1];
  const timeIndex = lastIntervalIndex % times.value.length;

  // Determine the end time using the same logic as in getRecommendedTimeBlocks()
  let endTime;
  if (timeIndex + 1 < times.value.length) {
    endTime = times.value[timeIndex + 1];
  } else {
    const [hour, minute] = lastInterval.time.split(":").map(Number);
    const newMinute = (minute + 30) % 60;
    const newHour = hour + Math.floor((minute + 30) / 60);
    endTime = `${String(newHour).padStart(2, "0")}:${String(
      newMinute
    ).padStart(2, "0")}`;
  }

  confirmedTimeslotString.value = `${formatDate(firstInterval.date)} ${
    firstInterval.time
  } - ${endTime}`;

  const { data: confirmedTimeslotData, error: confirmedTimeslotError } =
    await supabase
      .from("events")
      .update({ confirmed_timeslot: confirmedTimeslotString.value })
      .eq("id", event_id.value)
      .select();

  if (!confirmedTimeslotError) {
    toast({
      title: "Timeslot Confirmed",
      description: `You have confirmed the timeslot: ${confirmedTimeslotString.value}`,
      variant: "success",
    });

    participants_userIds.value.forEach(async (id) => {
      // console.log(id);
      const { data, error } = await supabase
        .from("notifications")  
        .insert([
          {
            user_id: id,
            message: `Timeslot confirmed in event ${event_title.value}: ${confirmedTimeslotString.value}`,
            target_path: `/event/${event_code}`,
          },
        ])
        .select();

      if (error) {
        console.error(
          "Error sending notifications to event participants:",
          error.message
        );
      }
    });
  } else {
    console.error(confirmedTimeslotError.message);
  }
}


function getConfirmMergedClass(dateIndex, timeIndex) {
  const hasAbove = timeIndex > 0 && isConfirmed(dateIndex, timeIndex - 1);
  const hasBelow =
    timeIndex < times.value.length - 1 && isConfirmed(dateIndex, timeIndex + 1);

  let classes = " border-x-4";

  if (hasAbove && hasBelow) {
    classes += " rounded-none border-t-0 border-b-0";
  } else if (hasAbove) {
    classes += " rounded-t-none border-t-0 border-b-4";
  } else if (hasBelow) {
    classes += " rounded-b-none border-b-0 border-t-4";
  } else {
    classes += " rounded-md border-4";
  }

  return classes;
}

const toLogin = () => {
  navigateTo({
    path: "/auth",
    query: { action: "login" },
  });
};

const toRegister = () => {
  navigateTo({
    path: "/auth",
    query: { action: "register" },
  });
};
</script>

<style scoped>
.interval-cell {
  cursor: pointer;
  user-select: none; /* Prevent text selection while dragging */
}

.interval-cell .selected {
  @apply bg-red-400 border-red-400;
}

.heatmap-cell .bg-indigo-600 {
  border-color: #4f46e5;
}

th,
td {
  text-align: center;
}
</style>
