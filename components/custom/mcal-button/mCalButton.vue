<template>
    <div>
      <!-- Display button for Microsoft Calendar connection -->
      <Button
        class="w-full transition-all duration-300 ease-in-out bg-green-600 hover:bg-red-600 text-white"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @click="disconnectMicrosoftCalendar"
        v-if="msCalConnected"
      >
        <template v-if="isHovered">
          <XCircle class="mr-2 size-4" /> Disconnect from Microsoft Calendar
        </template>
        <template v-else>
          <CircleCheckBig class="mr-2 size-4" /> Microsoft Calendar is Connected
        </template>
      </Button>
  
      <!-- Display Connect button if not connected -->
      <Button class="w-full" v-else @click="connectMicrosoftCalendar" variant="outline">
        <img
          src="/icons/microsoft.svg"
          alt="mIcon"
          class="mr-4 size-4 invert"
        />
        Connect to Microsoft Calendar
      </Button>
      <Toaster/>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { CircleCheckBig, XCircle } from 'lucide-vue-next'
  import { useToast } from '@/components/ui/toast/use-toast'
  import { Toaster, ToastAction } from '@/components/ui/toast'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const msCalConnected = ref(false)
  const isHovered = ref(false)
  const { toast } = useToast()
  
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Check if Microsoft calendar is connected
  const { data: mtokens, error } = await supabase
    .from('mtokens')
    .select('*')
    .eq('user_id', user.value.id)
    .single()
  
  if (mtokens) {
    msCalConnected.value = true
  } else if (error) {
    console.log(error.message)
  }
  
  // Function to connect to Microsoft Calendar
  async function connectMicrosoftCalendar() {
    try {
      const redirectFrom = route.fullPath
      window.location.href = `/api/microsoft/auth?redirect_uri=${encodeURIComponent(redirectFrom)}`
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'An error occurred during Microsoft calendar connection.',
        variant: 'destructive',
      })
    }
  }
  
  // Function to disconnect from Microsoft Calendar
  async function disconnectMicrosoftCalendar() {
    const { error: disconnectError } = await supabase
      .from('mtokens')
      .delete()
      .eq('user_id', user.value.id)
      .single()
  
    if (disconnectError) {
      console.log(disconnectError.message)
      toast({
        title: 'Disconnect Failed...',
        description: disconnectError.message,
        variant: 'destructive',
        action: h(
          ToastAction,
          {
            altText: 'Try again',
          },
          {
            default: () => 'Try again',
          }
        ),
      })
    } else {
      toast({
        title: 'Disconnect Success!',
        description: 'You have successfully disconnected your Microsoft Calendar.',
        variant: 'success',
      })
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }
  </script>
  
  <style scoped>
  /* Add any additional styling if needed */
  </style>
  