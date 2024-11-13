<template>
  <div>
    <ClientOnly>
      <div id="scroll-container" data-scroll-container>
        <main class="min-h-screen">
          <div class="relative w-screen min-h-screen">
            <!-- Gradient Background -->
            <div
              class="w-full h-full absolute inset-0 overflow-hidden bg-white dark:bg-black opacity-35 z-0"
            >
              <!-- SVG Filter -->
              <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
                <defs>
                  <filter id="goo">
                    <feGaussianBlur
                      in="SourceGraphic"
                      stdDeviation="10"
                      result="blur"
                    />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                      result="goo"
                    />
                    <feBlend in="SourceGraphic" in2="goo" />
                  </filter>
                </defs>
              </svg>

              <!-- Gradients Container -->
              <div
                class="w-full h-full z-0"
                :style="{ filter: 'url(#goo) blur(40px)' }"
              >
                <!-- Gradient Circles -->
                <div
                  v-for="(gradient, index) in gradients"
                  :key="index"
                  class="absolute z-0"
                  :style="[
                    $colorMode.value == 'dark'
                      ? darkGradientStyle(gradient)
                      : gradientStyle(gradient),
                    {
                      width: gradient.doubleSize ? '160%' : '80%',
                      height: gradient.doubleSize ? '160%' : '80%',
                      top: gradient.doubleSize ? '-30%' : '10%',
                      left: gradient.doubleSize ? '-30%' : '10%',
                      transformOrigin: gradient.transformOrigin,
                      animation: `${gradient.animation} ${gradient.duration}s ${gradient.timing} infinite`,
                      opacity: gradient.opacity,
                    },
                  ]"
                ></div>
              </div>
            </div>
            <div
              data-scroll-section
              class="h-[4.5rem] px-8 md:px-12 lg:px-16 flex flex-row items-center justify-between bg-transparent z-10"
            >
              <div class="flex flex-row items-center">
                <NuxtImg
                  src="/images/logo_light.png"
                  class="logo-animation"
                  v-if="$colorMode.value === 'light'"
                />
                <NuxtImg
                  src="/images/logo_dark.png"
                  class="logo-animation"
                  v-if="$colorMode.value === 'dark'"
                />
                <h1
                  v-if="!isMobile"
                  class="text-xl font-bold tracking-wider title-fade-in-left"
                >
                  Meet<span class="text-indigo-600 dark:text-indigo-500">L</span
                  >ah
                </h1>
              </div>
              <div class="flex flex-row items-center" v-if="!user">
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
              <div v-if="user" class="z-10">
                <Sheet>
                  <SheetTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="font-semibold border-zinc-200 dark:border-zinc-700 hover:bg-transparent"
                    >
                      <Avatar
                        class="w-8 h-8 border bg-zinc-50 dark:bg-zinc-900"
                      >
                        <img :src="profilePictureUrl" />
                      </Avatar>
                    </Button>
                  </SheetTrigger>
                  <SheetContent class="flex flex-col">
                    <SheetHeader class="flex flex-row items-center">
                      <Avatar class="w-10 h-10 mr-2">
                        <img :src="profilePictureUrl" />
                      </Avatar>
                      <div>
                        <SheetTitle class="text-left">
                          {{ displayName }}
                        </SheetTitle>
                        <SheetDescription class="text-left">
                          {{ email }}
                        </SheetDescription>
                      </div>
                    </SheetHeader>
                    <div class="flex flex-col gap-2 py-4">
                      <NuxtLink
                        to="/"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                        ><HouseIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Home
                      </NuxtLink>
                      <Separator class="my-2" />
                      <NuxtLink
                        to="/create-event"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                        ><CalendarPlusIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Create event
                      </NuxtLink>
                      <NuxtLink
                        to="/create-team"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                        ><UserRoundPlusIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Create team
                      </NuxtLink>
                      <NuxtLink
                        to="/create-project"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                        ><PackagePlusIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Create project
                      </NuxtLink>
                      <Separator class="my-2" />
                      <NuxtLink
                        to="/events"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                      >
                        <CalendarDaysIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Your events
                      </NuxtLink>
                      <NuxtLink
                        to="/teams"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                      >
                        <UsersRoundIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Your teams
                      </NuxtLink>
                      <NuxtLink
                        to="/projects"
                        class="flex flex-row items-center h-6 transform transition-transform duration-200 hover:translate-x-2"
                      >
                        <BoxesIcon size="16px" strokeWidth="{1}" class="mr-2" />
                        Your projects
                      </NuxtLink>

                      <Separator class="my-2" />
                      <Button
                        @click="logout"
                        variant="link"
                        class="justify-start font-normal text-base p-0 h-6"
                      >
                        <LogOutIcon
                          size="16px"
                          strokeWidth="{1}"
                          class="mr-2"
                        />
                        Logout
                      </Button>
                    </div>
                    <SheetFooter
                      class="absolute bottom-4 w-3/4 sm:w-auto self-center"
                    >
                      <SheetClose as-child> </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            <!-- Hero Section -->
            <section
              class="min-h-screen px-8 pt-8 lg:pt-[10vh] flex flex-col mx-auto justify-center items-center bg-transparent"
              data-scroll-section
            >
              <div
                class="relative z-10 flex-1 max-w-3xl w-full lg:text-center space-y-4 md:space-y-6 lg:space-y-8"
              >
                <h1
                  class="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight fade-in-bottom"
                  data-scroll
                >
                  <span class="keywords text-indigo-600">Schedule</span>
                  meetings <br />
                  <span class="keywords text-indigo-600">& Manage</span>
                  projects <br />
                  with ease.
                </h1>
                <p class="text-base lg:text-lg fade-in-bottom" data-scroll>
                  Work smarter, not harder, with
                  <span class="text-indigo-600 font-semibold">MeetLah</span>.
                </p>
                <div
                  class="flex flex-col md:flex-row gap-2 fade-in-bottom justify-center"
                  data-scroll
                >
                  <form
                    @submit.prevent="handleJoin"
                    class="flex flex-row justify-center"
                  >
                    <Input
                      v-model="joinCode"
                      id="join-code"
                      type="text"
                      placeholder="Enter Event Code"
                      required
                      class="w-full text-sm sm:text-base p-2 sm:p-3"
                    />
                    <Button class="w-28 ml-2"> Join Event </Button>
                  </form>
                  <Button
                    class="button-near-fade-in-left bg-indigo-600 text-white hover:bg-indigo-700"
                    @click="toCreate()"
                  >
                    Create Event
                  </Button>
                  <Button
                    variant="outline"
                    class="button-far-fade-in-left"
                    @click="toDesc()"
                  >
                    How it Works
                  </Button>
                </div>
              </div>
              <div
                class="relative z-0 lg:-translate-y-20 flex flex-col lg:flex-row w-full lg:h-full gap-4 lg:gap-16 lg:justify-center items-start lg:items-end lg:p-8 order-first lg:order-last"
              >
                <div
                  class="lg:hover:-translate-y-10 transition duration-300 ease-in-out"
                >
                  <div
                    class="relative w-56 md:w-64 lg:w-64 2xl:w-72 max-h-64 md:max-h-80 lg:max-h-none lg:h-96 border rounded-xl overflow-hidden relative card-far-fade-in-right"
                  >
                    <NuxtImg src="/images/meeting_stock.jpg" class="w-full" />
                  </div>
                </div>
                <div
                  class="lg:w-40 2xl:w-48 lg:h-80 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
                >
                  <div
                    class="relative lg:w-40 2xl:w-48 lg:h-80 border rounded-xl bg-indigo-700 card-near-fade-in-right hidden lg:block"
                  >
                    <div
                      class="p-4 flex flex-col h-full text-white justify-end"
                    >
                      <div class="flex-col">
                        <KanbanSquare
                          size="2rem"
                          stroke-width="1"
                          class="mb-2"
                        />
                        <h2 class="text-xl font-medium">
                          Streamlined Project Management
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="w-full md:w-3/4 lg:w-72 2xl:w-96 h-20 md:h-24 lg:h-64 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
                >
                  <div
                    class="relative w-full md:w-3/4 lg:w-72 2xl:w-96 h-20 md:h-24 lg:h-64 py-4 px-6 lg:py-8 lg:px-10 border border-indigo-100 dark:border-indigo-900 rounded-xl bg-white/60 dark:bg-zinc-950/60 fade-in-bottom flex flex-col justify-between"
                  >
                    <div
                      class="size-10 bg-indigo-100 dark:bg-indigo-700 rounded-lg items-center justify-center hidden lg:flex"
                    >
                      <ChartLine size="1.6rem" strokeWidth="1" />
                    </div>
                    <div
                      class="h-full lg:h-auto flex flex-row lg:flex-col lg:justify-end"
                    >
                      <p
                        class="w-32 lg:w-full text-xl tracking-tight"
                        v-if="!isMobile"
                      >
                        Total Events Scheduled:
                      </p>
                      <h1 class="text-5xl font-semibold lg:my-2 tracking-wide">
                        {{ eventCounter }}
                      </h1>
                      <div
                        class="ml-2 md:ml-auto lg:ml-0 flex flex-col justify-center"
                      >
                        <p class="text-xl tracking-tight" v-if="isMobile">
                          Events Scheduled
                        </p>
                        <p class="text-xs lg:text-base font-light">
                          Increase of
                          <span class="text-indigo-400">{{
                            monthlyCount
                          }}</span>
                          this month.
                        </p>
                      </div>
                      <div
                        class="size-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center self-center ml-auto"
                        v-if="isMobile"
                      >
                        <ChartLine size="1.6rem" strokeWidth="1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="w-40 2xl:w-48 lg:h-80 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
                >
                  <div
                    class="relative w-40 2xl:w-48 lg:h-80 border border-indigo-100 rounded-xl bg-indigo-100 dark:bg-indigo-200 card-near-fade-in-left hidden lg:block"
                  >
                    <div
                      class="p-4 flex flex-col h-full text-indigo-950 justify-end"
                    >
                      <div class="flex-col">
                        <Users size="2rem" stroke-width="1" />
                        <h2 class="text-xl font-medium mt-2">
                          Designed for Collaboration
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="w-full lg:w-64 lg:hover:-translate-y-10 transition duration-300 ease-in-out"
                >
                  <div
                    class="relative w-full lg:w-64 mb-8 lg:mb-0 h-1 lg:h-96 border rounded-xl bg-indigo-900 relative overflow-hidden card-far-fade-in-left"
                  >
                    <div
                      class="absolute w-[12rem] h-[12rem] -top-[10%] -left-[10%] bg-indigo-600 rounded-full scale-150 opacity-30 flex items-center justify-center"
                    >
                      <div
                        class="relative w-[45%] h-[45%] bg-indigo-900 rounded-full scale-150"
                      ></div>
                    </div>
                    <div class="absolute bottom-0 p-8">
                      <h1 class="text-xl font-light text-white">
                        Group assignments, team projects, or gatherings —
                        MeetLah is here to support you.
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <!-- Features Section -->
          <section
            class="lg:min-h-[130vh] px-8 py-20 bg-indigo-700 lg:flex lg:jusify-center lg:items-center"
            data-scroll-section
          >
            <div
              class="max-w-6xl mx-auto flex flex-col justify-center items-center gap-8"
              data-scroll
              data-scroll-speed="1"
            >
              <div class="max-w-2xl mb-10" data-scroll>
                <h1
                  class="text-4xl lg:text-5xl text-white lg:text-center font-semibold opacity-0"
                  data-scroll
                  data-scroll-class="appear"
                >
                  Smart Scheduling & <br />Powerful Project Management
                </h1>
                <p
                  class="text-sm lg:text-base text-white lg:text-center font-light mt-8 opacity-0"
                  data-scroll
                  data-scroll-class="appear"
                >
                  Effortlessly organize your meetings and manage projects with
                  all the tools you need right at your fingertips. Simplify
                  collaboration and stay on track with ease.
                </p>
              </div>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card
                  class="relative opacity-0 overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                  data-scroll
                  data-scroll-class="appear-card"
                >
                  <CardHeader data-scroll>
                    <div
                      class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                      data-scroll
                    >
                      <CalendarDays size="2.5rem" strokeWidth="1" />
                    </div>
                    <CardTitle data-scroll>Event Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent data-scroll>
                    <p class="font-light text-base">
                      Automatically find the perfect meeting time across
                      multiple calendars and team members.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="relative opacity-0 overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                  data-scroll
                  data-scroll-class="appear-card"
                >
                  <CardHeader data-scroll>
                    <div
                      class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                      data-scroll
                    >
                      <KanbanSquare size="2.5rem" strokeWidth="1" />
                    </div>
                    <CardTitle data-scroll>Project Tracking</CardTitle>
                  </CardHeader>
                  <CardContent data-scroll>
                    <p class="font-light text-base">
                      Keep your projects on track with intuitive task management
                      and progress monitoring.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="relative opacity-0 overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                  data-scroll
                  data-scroll-class="appear-card"
                >
                  <CardHeader data-scroll>
                    <div
                      class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                      data-scroll
                    >
                      <Users size="2.5rem" strokeWidth="1" />
                    </div>
                    <CardTitle data-scroll>Team Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent data-scroll>
                    <p class="font-light text-base">
                      Foster seamless collaboration with powerful team
                      management features.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="relative opacity-0 overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                  data-scroll
                  data-scroll-class="appear-card"
                >
                  <CardHeader data-scroll>
                    <div
                      class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                      data-scroll
                    >
                      <CalendarArrowUp size="2.5rem" strokeWidth="1" />
                    </div>
                    <CardTitle data-scroll>Import Existing Calendars</CardTitle>
                  </CardHeader>
                  <CardContent data-scroll>
                    <p class="font-light text-base">
                      Import from Google or Microsoft Outlook and let MeetLah
                      indicate your availability for you.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="relative opacity-0 overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                  data-scroll
                  data-scroll-class="appear-card"
                >
                  <CardHeader data-scroll>
                    <div
                      class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                      data-scroll
                    >
                      <Vote size="2.5rem" strokeWidth="1" />
                    </div>
                    <CardTitle data-scroll>Make Decisions</CardTitle>
                  </CardHeader>
                  <CardContent data-scroll>
                    <p class="font-light text-base">
                      A robust and intuitive polls feature within each event
                      allows for rapid decision-making.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="relative opacity-0 overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                  data-scroll
                  data-scroll-class="appear-card"
                >
                  <CardHeader data-scroll>
                    <div
                      class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                      data-scroll
                    >
                      <MapPin size="2.5rem" strokeWidth="1" />
                    </div>
                    <CardTitle data-scroll>Find Central Location</CardTitle>
                  </CardHeader>
                  <CardContent data-scroll>
                    <p class="font-light text-base">
                      MeetLah suggests a convenient meeting location based on
                      event participants' locations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <!-- Description Section -->
          <section
            id="description"
            class="min-h-screen px-4 py-20 overflow-hidden bg-white dark:bg-black"
            data-scroll-section
          >
            <div
              class="max-w-6xl mx-auto h-full my-20 flex flex-col gap-20"
              data-scroll
              data-scroll-speed="1"
            >
              <div
                class="flex flex-col md:flex-row justify-between px-8"
                data-scroll
              >
                <div
                  data-scroll
                  data-scroll-class="appear"
                  class="opacity-0 max-w-lg lg:max-w-2xl"
                >
                  <h1 class="text-4xl lg:text-5xl font-semibold">
                    How it Works
                  </h1>
                  <p class="text-lg font-light mt-6">
                    <span
                      class="text-indigo-600 dark:text-indigo-400 font-normal"
                      >MeetLah</span
                    >'s simple, minimalist interface offers an intuitive,
                    fuss-free experience, allowing users to navigate and engage
                    effortlessly without distractions.
                  </p>
                </div>
                <div
                  class="flex items-center opacity-0 mt-8"
                  data-scroll
                  data-scroll-class="appear"
                >
                  <Button
                    @click="toRegister"
                    class="bg-indigo-600 hover:bg-indigo-700 dark:text-white"
                    >Try Now</Button
                  >
                </div>
              </div>
              <div
                class="my-12 lg:my-20 px-8 gap-8 md:gap-12 flex flex-col lg:flex-row justify-evenly items-center opacity-0"
                data-scroll
                data-scroll-class="appear"
              >
                <div
                  class="relative z-10 w-[38rem] h-80 overflow-hidden"
                  v-if="$colorMode.value === 'light'"
                >
                  <img
                    src="/images/landing_img_light_1.png"
                    class="absolute top-12 left-0 max-w-none object-none"
                  />
                  <img
                    src="/images/landing_img_light_2.png"
                    class="absolute top-0 left-64 max-w-none object-none"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white z-10"
                  ></div>
                </div>
                <div
                  class="relative z-10 w-[38rem] h-80 overflow-hidden"
                  v-if="$colorMode.value === 'dark'"
                >
                  <img
                    src="/images/landing_img_dark_1.png"
                    class="absolute top-12 left-0 max-w-none object-none"
                  />
                  <img
                    src="/images/landing_img_dark_2.png"
                    class="absolute top-0 left-64 max-w-none object-none"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-black z-10"
                  ></div>
                </div>
                <div
                  class="w-96 z-0"
                  data-scroll
                  data-scroll-direction="horizontal"
                  data-scroll-speed="4"
                >
                  <h1 class="text-3xl font-medium">
                    <Calendar class="mb-1" />
                    Schedule Events
                  </h1>
                  <p class="mt-8 font-light">
                    Easily create and share events with others, marking your
                    unavailable times. See everyone's availability at a glance
                    and find the ideal timeslot that works for the whole group.
                  </p>
                </div>
              </div>
              <div
                class="my-12 lg:my-20 px-8 gap-8 md:gap-12 flex flex-col lg:flex-row justify-evenly items-center opacity-0"
                data-scroll
                data-scroll-class="appear"
              >
                <div
                  class="w-96 order-last lg:order-first"
                  data-scroll
                  data-scroll-direction="horizontal"
                  data-scroll-speed="-4"
                >
                  <h1 class="text-3xl font-medium">
                    <Users class="mb-1" />
                    Organize Teams
                  </h1>
                  <p class="mt-8 font-light">
                    Manage your team effortlessly with tools for assigning
                    roles, inviting or removing members, and viewing all
                    projects at a glance. Keep everyone aligned and informed in
                    one centralized space.
                  </p>
                </div>
                <div
                  class="relative w-[36rem] h-80 overflow-hidden"
                  data-scroll
                  v-if="$colorMode.value === 'light'"
                >
                  <img
                    src="/images/landing_img_light_1.png"
                    class="absolute top-12 left-0 max-w-none object-none"
                  />
                  <img
                    src="/images/landing_img_light_2.png"
                    class="absolute top-0 left-64 max-w-none object-none"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white z-10"
                  ></div>
                </div>
                <div
                  class="relative w-[36rem] h-80 overflow-hidden"
                  data-scroll
                  v-if="$colorMode.value === 'dark'"
                ></div>
              </div>
              <div
                class="mt-12 lg:mt-20 px-8 gap-8 md:gap-12 flex flex-col lg:flex-row justify-evenly items-center opacity-0"
                data-scroll
                data-scroll-class="appear"
              >
                <div
                  class="relative w-[48rem] h-[40rem] overflow-hidden z-10"
                  v-if="$colorMode.value === 'light'"
                  data-scroll
                >
                  <img
                    src="/images/landing_img_light_3.png"
                    class="absolute -top-32 -left-32 max-w-none scale-[0.7]"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white z-10"
                  ></div>
                  <div
                    class="absolute bottom-0 right-0 right-0 w-1/4 h-full bg-gradient-to-r from-transparent to-white z-10"
                  ></div>
                </div>
                <div
                  class="relative w-[48rem] h-[40rem] overflow-hidden z-10"
                  v-if="$colorMode.value === 'dark'"
                  data-scroll
                >
                  <img
                    src="/images/landing_img_dark_3.png"
                    class="absolute -top-32 -left-32 max-w-none scale-[0.7]"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-black z-10"
                  ></div>
                  <div
                    class="absolute bottom-0 right-0 right-0 w-1/4 h-full bg-gradient-to-r from-transparent to-black z-10"
                  ></div>
                </div>
                <div
                  class="w-96 z-0"
                  data-scroll
                  data-scroll-direction="horizontal"
                  data-scroll-speed="4"
                >
                  <h1 class="text-3xl font-medium">
                    <KanbanSquare class="mb-1" />
                    Track Projects
                  </h1>
                  <p class="mt-8 font-light">
                    Stay on top of tasks and deadlines with powerful project
                    management tools. Use shared to-do lists, a kanban board for
                    workflow tracking, and a Gantt chart for timeline
                    visualization to keep projects on track and team members
                    aligned.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- CTA Section -->
          <section
            class="relative px-4 py-20 bg-white dark:bg-black"
            data-scroll-section
          >
            <div
              class="relative w-[90%] h-[50vh] bg-black border rounded-lg overflow-hidden flex items-center justify-start mx-auto px-8 lg:px-24 opacity-0"
              data-scroll
              data-scroll-class="appear-cta"
            >
              <div class="relative z-10 max-w-sm lg:max-w-xl text-white">
                <h2
                  class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 opacity-0"
                  data-scroll
                  data-scroll-class="appear-cta-content"
                >
                  Ready to transform how your team works?
                </h2>
                <p
                  class="mb-8 text-base lg:text-lg font-light opacity-0"
                  data-scroll
                  data-scroll-class="appear-cta-content"
                >
                  Join tens of users already using MeetLah to streamline their
                  workflows and schedule their events the smart way.
                </p>
                <Button
                  @click="toRegister"
                  size="lg"
                  variant="secondary"
                  class="px-8 bg-indigo-600 hover:bg-indigo-700 text-white opacity-0"
                  data-scroll
                  data-scroll-class="appear-cta-content"
                >
                  Get Started
                </Button>
              </div>
              <div
                class="absolute z-0 bottom-0 left-0 right-0 h-full bg-gradient-to-br from-transparent to-indigo-600/70 dark:to-indigo-600/30"
              ></div>
            </div>
          </section>
          <PageFooter data-scroll-section class="bg-white dark:bg-zinc-950" />
          <Toaster />
        </main>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { EnterIcon } from "@radix-icons/vue";
import { useColorMode, useMediaQuery } from "@vueuse/core";
import {
  Calendar,
  CalendarArrowUp,
  CalendarDays,
  ChartLine,
  KanbanSquare,
  MapPin,
  Users,
  Vote,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { onMounted, nextTick, ref } from "vue";
import { PageFooter } from "@/components/custom/page-footer";
import { navigateTo } from "nuxt/app";
import { useToast } from "@/components/ui/toast/use-toast";
import { Toaster, ToastAction } from "@/components/ui/toast";
import {
  UsersRoundIcon,
  CalendarDaysIcon,
  BoxesIcon,
  LogOutIcon,
  HouseIcon,
  CalendarPlusIcon,
  PackagePlusIcon,
  UserRoundPlusIcon,
} from "lucide-vue-next";

const eventCounter = ref(0);
const monthlyCount = ref(0);
const joinCode = ref("");
const scrollInstance = ref(null);
let scrollElement = null;
const user = useSupabaseUser();

const displayName = ref("");
const email = ref("");
const profilePictureUrl = ref("");
const colorMode = useColorMode();
const { toast } = useToast();
const { $initLocomotiveScroll } = useNuxtApp();
const supabase = useSupabaseClient();
const isMobile = useMediaQuery("(max-width: 600px)");

if (user.value) {
  displayName.value = ref(user.value.user_metadata.name);
  email.value = ref(user.value.email);
  if (
    user.value.app_metadata.provider == "email" &&
    !user.value.app_metadata.providers.includes("google")
  ) {
    const { data: profilePicData, error: profilePicError } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(`pics/${user.value.id}`);
    if (profilePicError) {
      const { data: defaultProfilePicData, error: defaultProfilePicError } =
        supabase.storage
          .from("profile-pictures")
          .getPublicUrl(`default-pics/default-${user.value.id}.png`);
      if (defaultProfilePicError) {
        console.error(defaultProfilePicError.message);
      } else {
        profilePictureUrl.value = defaultProfilePicData.publicUrl;
      }
    } else {
      profilePictureUrl.value = profilePicData.publicUrl;
    }
  } else {
    profilePictureUrl.value = user.value.user_metadata.avatar_url;
  }
}

// Light mode gradients (indigo-50 to indigo-600)
const gradients = [
  {
    color: "238, 242, 255", // indigo-50
    animation: "moveVertical",
    duration: 30,
    timing: "ease",
    transformOrigin: "center center",
    opacity: 0.7, // Slightly reduced from 0.8
  },
  {
    color: "224, 231, 255", // indigo-100
    animation: "moveInCircle",
    duration: 20,
    timing: "ease",
    transformOrigin: "calc(50% - 400px)",
    opacity: 0.7,
  },
  {
    color: "199, 210, 254", // indigo-200
    animation: "moveInCircle",
    duration: 40,
    timing: "linear",
    transformOrigin: "calc(50% + 400px)",
    opacity: 0.7,
  },
  {
    color: "165, 180, 252", // indigo-300
    animation: "moveHorizontal",
    duration: 40,
    timing: "ease",
    transformOrigin: "calc(50% - 200px)",
    opacity: 0.6, // Slightly reduced from 0.7
  },
  {
    color: "129, 140, 248", // indigo-400
    animation: "moveInCircle",
    duration: 20,
    timing: "ease",
    transformOrigin: "calc(50% - 800px) calc(50% + 200px)",
    opacity: 0.7,
    doubleSize: true,
  },
  {
    color: "99, 102, 241", // indigo-500
    animation: "moveDiagonal",
    duration: 25,
    timing: "ease-in-out",
    transformOrigin: "calc(50% + 600px) calc(50% - 200px)",
    opacity: 0.7,
  },
  {
    color: "79, 70, 229", // indigo-600
    animation: "moveFigureEight",
    duration: 35,
    timing: "ease-in-out",
    transformOrigin: "center center",
    opacity: 0.65,
  },
];

// Dark mode gradients (indigo-400 to indigo-950)
const darkGradients = [
  {
    color: "129, 140, 248", // indigo-400
    opacity: 0.7,
  },
  {
    color: "99, 102, 241", // indigo-500
    opacity: 0.7,
  },
  {
    color: "79, 70, 229", // indigo-600
    opacity: 0.7,
  },
  {
    color: "67, 56, 202", // indigo-700
    opacity: 0.6,
  },
  {
    color: "55, 48, 163", // indigo-800
    opacity: 0.7,
  },
  {
    color: "49, 46, 129", // indigo-900
    opacity: 0.7,
  },
  {
    color: "30, 27, 75", // indigo-950
    opacity: 0.65,
  },
];

// Light mode gradient style
const gradientStyle = (gradient) => ({
  background: `radial-gradient(circle at center, rgba(${gradient.color}, 0.7) 0, rgba(${gradient.color}, 0) 50%)`,
  mixBlendMode: "multiply",
});

// Dark mode gradient style
const darkGradientStyle = (gradient) => {
  const darkGradient = darkGradients[gradients.indexOf(gradient)];
  return {
    background: `radial-gradient(circle at center, rgba(${darkGradient.color}, 0.7) 0, rgba(${darkGradient.color}, 0) 50%)`,
    mixBlendMode: "multiply",
  };
};

function animateValue(refVar, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    refVar.value = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
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

const toCreate = () => {
  navigateTo("/create-event");
};

const toDesc = () => {
  const element = document.getElementById("description");
  if (element) {
    // console.log(scrollInstance.value);
    if (scrollInstance.value) {
      scrollInstance.value.scrollTo(element);
    }
  }
};

const handleJoin = async () => {
  const code = joinCode.value.trim();

  if (code.length !== 6) {
    toast({
      title: "Invalid Join Code.",
      description: "Please enter a 6-character Join Code.",
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "Try again",
        },
        {
          default: () => "Try again",
        }
      ),
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .select("code")
      .eq("code", code)
      .single();

    if (error || !data) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Could not find your event.",
        variant: "destructive",
        action: h(
          ToastAction,
          {
            altText: "Try again",
          },
          {
            default: () => "Try again",
          }
        ),
      });
    } else {
      navigateTo(`/event/${code}`);
    }
  } catch (err) {
    toast({
      title: "Uh oh! Something went wrong.",
      description: err.message,
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "Try again",
        },
        {
          default: () => "Try again",
        }
      ),
    });
  }
};

onMounted(async () => {
  await nextTick();
  scrollElement = $initLocomotiveScroll("#scroll-container");
  scrollInstance.value = scrollElement;

  const elements = document.querySelectorAll(".fade-in-bottom");
  elements.forEach((el, index) => {
    el.style.setProperty("--i", index);
  });

  const { count: eventCount, error: eventCountError } = await supabase
    .from("events")
    .select("*", { count: "estimated", head: true });

  if (eventCountError) {
    console.error(eventCountError.message);
  } else {
    setTimeout(() => {
      animateValue(eventCounter, 0, eventCount, 1000);
    }, 1000);
  }

  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).toISOString();

  const { count: monthlyEventCount, error: monthlyEventCountError } =
    await supabase
      .from("events")
      .select("*", { count: "estimated", head: true })
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth);

  if (monthlyEventCountError) {
    console.error(monthlyEventCountError.message);
  } else {
    setTimeout(() => {
      animateValue(monthlyCount, 0, monthlyEventCount, 1000);
    }, 1000);
  }
});

onBeforeRouteLeave(() => {
  if (scrollInstance.value) {
    scrollInstance.value = null; // Clear scroll instance ref
  }
  if (scrollElement) {
    scrollElement.destroy(); // Only call destroy if scrollElement exists
    scrollElement = null; // Set scrollElement to null after destroying it
  }
});

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message); // Logs the error if something goes wrong
  } else {
    // console.log("Logged out successfully!");
    location.reload();
  }
};
</script>

<style>
@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

@keyframes moveDiagonal {
  0% {
    transform: translate(-30%, -30%);
  }
  50% {
    transform: translate(30%, 30%);
  }
  100% {
    transform: translate(-30%, -30%);
  }
}

@keyframes moveFigureEight {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20%, 20%) scale(0.9);
  }
  50% {
    transform: translate(0, 40%) scale(1);
  }
  75% {
    transform: translate(-20%, 20%) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

@keyframes fadeInTop {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInBottom {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(30%);
  }

  100% {
    opacity: 1;
    transform: scale(100%);
  }
}

@keyframes fadeInCta {
  0% {
    opacity: 0;
    transform: scale(95%);
  }

  100% {
    opacity: 1;
    transform: scale(100%);
  }
}

.appear {
  animation: fadeInBottom 1s ease-in-out 0.2s forwards;
}

.appear-card {
  animation: fadeInScale 1s ease-in-out 0.4s forwards;
}

.appear-cta {
  animation: fadeInCta 0.5s ease-in-out 0.2s forwards;
}

.appear-cta-content {
  animation: fadeInBottom 1s ease-in-out 0.8s forwards;
}

.title-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 1s ease-out forwards;
  animation-delay: 0.5s;
  /* Adjust the delay as needed */
}

.button-near-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 0.4s ease-out forwards;
  animation-delay: 1.2s;
  /* Adjust the delay as needed */
}

.button-far-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 0.4s ease-out forwards;
  animation-delay: 1.6s;
  /* Adjust the delay as needed */
}

.card-near-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 0.8s ease-out forwards;
  animation-delay: 1.6s;
  /* Adjust the delay as needed */
}

.card-far-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 0.8s ease-out forwards;
  animation-delay: 2s;
  /* Adjust the delay as needed */
}

.card-near-fade-in-right {
  opacity: 0;
  animation: fadeInRight 0.8s ease-out forwards;
  animation-delay: 1.6s;
  /* Adjust the delay as needed */
}

.card-far-fade-in-right {
  opacity: 0;
  animation: fadeInRight 0.8s ease-out forwards;
  animation-delay: 2s;
  /* Adjust the delay as needed */
}

.logo-animation {
  @apply size-12 transform transition-all mr-2;
  animation: fadeInBottom 0.5s ease-out forwards;
  transform-origin: top left;
}

.start-button-animation {
  @apply transform transition-all;
  animation: fadeInBottom 0.5s ease-out forwards;
  transform-origin: top left;
}

.login-button-animation {
  opacity: 0;
  animation: fadeInRight 1s ease-out forwards;
  animation-delay: 0.5s;
  /* Adjust the delay as needed */
}

.fade-in-bottom {
  opacity: 0;
  animation: fadeInBottom 0.8s ease-out forwards;
  animation-delay: calc(0.4s + var(--i) * 0.2s);
}
</style>
