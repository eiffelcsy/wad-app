<template>
  <ClientOnly>
    <div id="scroll-container" data-scroll-container>
      <main class="min-h-screen">
        <!-- Hero Section -->
        <section class="px-4 py-20 md:py-32" data-scroll-section>
          <div class="max-w-6xl mx-auto">
            <div class="flex flex-col md:flex-row items-center gap-12">
              <div class="flex-1 space-y-8">
                <h1
                  class="text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
                  data-scroll
                >
                  Schedule meetings & manage projects with ease
                </h1>
                <p class="text-xl text-gray-600">
                  MeetLah combines intelligent scheduling with powerful project
                  management tools to help teams work smarter, not harder.
                </p>
                <div class="flex gap-4">
                  <Button size="lg" variant="default">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline">
                    <PlayCircle class="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div class="flex-1 relative">
                <div
                  class="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-2xl transform rotate-2"
                ></div>
                <img
                  src=""
                  alt="MeetLah Dashboard Preview"
                  class="relative rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="px-4 py-20 bg-white">
          <div class="max-w-6xl mx-auto">
            <div class="grid md:grid-cols-3 gap-8">
              <Card class="relative overflow-hidden">
                <CardHeader>
                  <div
                    class="h-12 w-12 rounded-lg bg-black/90 flex items-center justify-center mb-4"
                  >
                    <Calendar class="h-6 w-6 text-white" />
                  </div>
                  <CardTitle class="text-xl">Smart Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-gray-600">
                    Automatically find the perfect meeting time across multiple
                    calendars and timezones.
                  </p>
                </CardContent>
              </Card>

              <Card class="relative overflow-hidden">
                <CardHeader>
                  <div
                    class="h-12 w-12 rounded-lg bg-black/90 flex items-center justify-center mb-4"
                  >
                    <KanbanSquare class="h-6 w-6 text-white" />
                  </div>
                  <CardTitle class="text-xl">Project Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-gray-600">
                    Keep your projects on track with intuitive task management
                    and progress monitoring.
                  </p>
                </CardContent>
              </Card>

              <Card class="relative overflow-hidden">
                <CardHeader>
                  <div
                    class="h-12 w-12 rounded-lg bg-black/90 flex items-center justify-center mb-4"
                  >
                    <Users class="h-6 w-6 text-white" />
                  </div>
                  <CardTitle class="text-xl">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-gray-600">
                    Foster seamless collaboration with integrated chat, file
                    sharing, and team spaces.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <!-- Social Proof Section -->
        <section class="px-4 py-20">
          <div class="max-w-6xl mx-auto text-center">
            <p class="text-gray-600 mb-8 text-lg">Trusted by teams at</p>
            <div class="flex flex-wrap justify-center gap-12 opacity-50">
              <NuxtImg
                src="/images/company-1.png"
                alt="Company Logo 1"
                class="h-10 w-auto"
              />
              <NuxtImg
                src="/images/company-2.png"
                alt="Company Logo 2"
                class="h-10 w-auto"
              />
              <NuxtImg
                src="/images/company-3.png"
                alt="Company Logo 3"
                class="h-10 w-auto"
              />
              <NuxtImg
                src="/images/company-4.png"
                alt="Company Logo 4"
                class="h-10 w-auto"
              />
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="px-4 py-20 bg-black text-white">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform how your team works?
            </h2>
            <p class="text-gray-400 mb-8 text-lg">
              Join thousands of teams already using MeetLah to streamline their
              workflows.
            </p>
            <Button size="lg" variant="secondary" class="px-8">
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>
    </div>
  </ClientOnly>
</template>

<script setup>
import { onMounted } from 'vue';
const { $initLocomotiveScroll } = useNuxtApp();

onMounted(() => {
  $initLocomotiveScroll('#scroll-container');
});
</script>

<style></style>
