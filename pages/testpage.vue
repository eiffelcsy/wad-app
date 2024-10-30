<template>
  <ClientOnly>
    <div id="scroll-container" data-scroll-container>
      <main class="min-h-screen">
        <div
          data-scroll-section
          class="h-[4.5rem] px-8 md:px-12 lg:px-16 flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-950"
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
              MeetLah
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
              class="w-28 button-fade-in-left bg-indigo-600 hover:bg-indigo-700 start-button-animation dark:text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
        <!-- Hero Section -->
        <section
          class="h-screen px-8 pt-8 lg:pt-[10vh] flex flex-col mx-auto justify-center items-center bg-zinc-50 dark:bg-zinc-950"
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
              class="flex flex-col md:flex-row gap-4 fade-in-bottom justify-center"
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
                <Button
                  class="w-28 ml-2 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Join Event
                </Button>
              </form>
              <Button variant="outline" class="w-28 button-fade-in-left">
                How it Works
              </Button>
            </div>
          </div>
          <div
            class="relative z-0 lg:-translate-y-20 flex flex-col lg:flex-row w-full lg:h-full gap-4 lg:gap-16 lg:justify-center items-start lg:items-end lg:p-8 order-first lg:order-last"
          >
            <div
              class="hover:-translate-y-10 transition duration-300 ease-in-out"
            >
              <div
                class="relative w-56 md:w-64 lg:w-72 max-h-64 md:max-h-80 lg:max-h-none lg:h-96 border rounded-xl overflow-hidden relative card-far-fade-in-right"
              >
                <NuxtImg src="/images/meeting_stock.jpg" class="w-full" />
              </div>
            </div>
            <div
              class="hover:-translate-y-10 transition duration-300 ease-in-out"
            >
              <div
                class="relative w-full md:w-3/4 lg:w-48 h-20 md:h-24 lg:h-80 border rounded-xl bg-indigo-700 card-near-fade-in-right"
              ></div>
            </div>
            <div
              class="hover:-translate-y-10 transition duration-300 ease-in-out"
            >
              <div
                class="relative w-96 lg:h-64 border rounded-xl bg-white dark:bg-zinc-950 fade-in-bottom hidden lg:block"
              ></div>
            </div>

            <div
              class="hover:-translate-y-10 transition duration-300 ease-in-out"
            >
              <div
                class="relative w-48 lg:h-80 border rounded-xl bg-indigo-100 dark:bg-indigo-200 card-near-fade-in-left hidden lg:block"
              ></div>
            </div>

            <div
              class="hover:-translate-y-10 transition duration-300 ease-in-out"
            >
              <div
                class="relative w-full lg:w-72 mb-8 lg:mb-0 h-1 lg:h-96 border rounded-xl bg-indigo-900 relative overflow-hidden card-far-fade-in-left"
              >
                <div
                  class="absolute w-[12rem] h-[12rem] -top-[10%] -left-[10%] bg-indigo-600 rounded-full scale-150 opacity-30 flex items-center justify-center"
                >
                  <div
                    class="relative w-[45%] h-[45%] bg-indigo-900 rounded-full scale-150"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="h-[120vh] px-4 py-20 bg-indigo-700" data-scroll-section>
          <div
            class="max-w-6xl mx-auto h-full flex flex-col justify-center items-center gap-8"
          >
            <div class="max-w-3xl mb-10">
              <h1 class="text-5xl text-white text-center font-semibold">
                Smart Scheduling and <br />Powerful Project Management
              </h1>
              <p class="text-base text-white text-center font-light mt-8">
                Simplify your meetups and projects with our tools at your
                fingertips
              </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
              <Card
                class="relative overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                data-scroll
              >
                <CardHeader data-scroll>
                  <div
                    class="h-12 w-12 rounded-lg flex items-center justify-center mb-12"
                    data-scroll
                  >
                    <CalendarDays size="2.5rem" strokeWidth="1" />
                  </div>
                  <CardTitle data-scroll>Smart Scheduling</CardTitle>
                </CardHeader>
                <CardContent data-scroll>
                  <p class="font-light text-base">
                    Automatically find the perfect meeting time across multiple
                    calendars and team members.
                  </p>
                </CardContent>
              </Card>

              <Card
                class="relative overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                data-scroll
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
                class="relative overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                data-scroll
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
                    Foster seamless collaboration with powerful team management
                    features.
                  </p>
                </CardContent>
              </Card>

              <Card
                class="relative overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                data-scroll
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
                class="relative overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                data-scroll
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
                    A robust and intuitive polls feature allows for rapid
                    decision-making.
                  </p>
                </CardContent>
              </Card>

              <Card
                class="relative overflow-hidden bg-indigo-600/50 border-none text-white hover:bg-indigo-800 hover:scale-110 transition duration-300 ease-in-out"
                data-scroll
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
        <section class="min-h-screen px-4 py-20" data-scroll-section>
          <div class="max-w-6xl mx-auto h-full my-20 flex flex-col gap-20">
            <div class="flex flex-row justify-between">
              <div>
                <h1 class="text-5xl font-semibold">How it Works</h1>
                <p class="text-lg font-light mt-6">
                  <span class="text-indigo-600 dark:text-indigo-400 font-normal"
                    >MeetLah</span
                  >'s simple, minimalist interface makes for an intuitive,
                  fuss-free experience.
                </p>
              </div>
              <div class="flex items-end">
                <Button
                  class="bg-indigo-600 hover:bg-indigo-700 dark:text-white"
                  >Try Now</Button
                >
              </div>
            </div>
            <div class="my-10 flex flex-row justify-evenly items-center">
              <div class="relative w-[36rem] h-80 overflow-hidden" v-if="$colorMode.value === 'light'">
                <img
                  src="/images/landing_img_1.png"
                  class="absolute top-12 left-0 max-w-none object-none"
                />
                <img
                  src="/images/landing_img_2.png"
                  class="absolute top-0 left-64 max-w-none object-none"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white z-10"
                ></div>
              </div>
              <div class="relative w-[36rem] h-80 overflow-hidden" v-if="$colorMode.value === 'dark'">
                
              </div>
              <div class="w-96">
                <h1 class="text-3xl font-medium">
                  <Calendar class="mb-1" />
                  Schedule Events
                </h1>
                <p class="mt-8 font-light">
                  Easily create and share events with others, marking your
                  unavailable times. See everyone's availability at a glance and
                  find the ideal timeslot that works for the whole group.
                </p>
              </div>
            </div>
            <div class="my-10 flex flex-row justify-evenly items-center">
              <div class="w-96">
                <h1 class="text-3xl font-medium">
                  <Users class="mb-1" />
                  Organize Teams
                </h1>
                <p class="mt-8 font-light">
                  Manage your team effortlessly with tools for assigning roles,
                  inviting or removing members, and viewing all projects at a
                  glance. Keep everyone aligned and informed in one centralized
                  space.
                </p>
              </div>
              <div class="relative w-[36rem] h-80 overflow-hidden" v-if="$colorMode.value === 'light'">
                <img
                  src="/images/landing_img_1.png"
                  class="absolute top-12 left-0 max-w-none object-none"
                />
                <img
                  src="/images/landing_img_2.png"
                  class="absolute top-0 left-64 max-w-none object-none"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white z-10"
                ></div>
              </div>
              <div class="relative w-[36rem] h-80 overflow-hidden" v-if="$colorMode.value === 'dark'">
                
              </div>
            </div>
            <div class="my-10 flex flex-row justify-evenly items-center">
              <div class="relative w-[36rem] h-80 overflow-hidden" v-if="$colorMode.value === 'light'">
                <img
                  src="/images/landing_img_1.png"
                  class="absolute top-12 left-0 max-w-none object-none"
                />
                <img
                  src="/images/landing_img_2.png"
                  class="absolute top-0 left-64 max-w-none object-none"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white z-10"
                ></div>
              </div>
              <div class="relative w-[36rem] h-80 overflow-hidden" v-if="$colorMode.value === 'dark'">
                
              </div>
              <div class="w-96">
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
        <section class="relative px-4 my-20" data-scroll-section>
          <div
            class="relative w-[90%] h-[50vh] bg-black border rounded-lg overflow-hidden flex items-center justify-start mx-auto px-24"
          >
            <div class="relative z-10 max-w-xl text-white">
              <h2 class="text-3xl md:text-5xl font-semibold mb-8" data-scroll>
                Ready to transform how your team works?
              </h2>
              <p class="mb-8 text-lg font-light" data-scroll>
                Join tens of users already using MeetLah to streamline their
                workflows and schedule their events the smart way.
              </p>
              <Button
                size="lg"
                variant="secondary"
                class="px-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                data-scroll
              >
                Get Started
              </Button>
            </div>
            <div
              class="absolute z-0 bottom-0 left-0 right-0 h-full bg-gradient-to-br from-transparent to-indigo-600/70 dark:to-indigo-600/30"
            ></div>
          </div>
        </section>
        <PageFooter data-scroll-section />
      </main>
    </div>
  </ClientOnly>
</template>

<script setup>
import { EnterIcon } from "@radix-icons/vue";
import { useMediaQuery } from "@vueuse/core";
import {
  Calendar,
  CalendarArrowUp,
  CalendarDays,
  KanbanSquare,
  MapPin,
  Users,
  Vote,
} from "lucide-vue-next";
import { onMounted, nextTick } from "vue";
import { PageFooter } from "@/components/custom/page-footer";

const colorMode = useColorMode();
const { $initLocomotiveScroll } = useNuxtApp();

const isMobile = useMediaQuery("(max-width: 600px)");

onMounted(async () => {
  await nextTick();
  $initLocomotiveScroll("#scroll-container");

  const elements = document.querySelectorAll(".fade-in-bottom");
  elements.forEach((el, index) => {
    el.style.setProperty("--i", index);
  });
});
</script>

<style>
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

.title-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 1s ease-out forwards;
  animation-delay: 0.5s;
  /* Adjust the delay as needed */
}

.button-fade-in-left {
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
