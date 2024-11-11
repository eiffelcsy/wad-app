<template>
  <div>
    <Button @click="getUserLocation" class="mb-4 w-full" variant="outline">Share My Location</Button>
    <GoogleMap
      :api-key="apiKey"
      style="width: 100%; height: 500px"
      :center="mapCenter"
      :zoom="mapZoom"
    >
      <Marker
        v-for="(location, index) in userLocations"
        :key="index"
        :options="{ position: location, label: index }"
      />

      <Polyline
        v-for="(location, index) in userLocations"
        :key="'polyline-' + index"
        :options="{
            path: [location, centralPoint],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        }"
      />
    </GoogleMap>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { GoogleMap, Marker, Polyline } from "vue3-google-map";
import { Button } from "@/components/ui/button";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const apiKey = config.public.GMAPS_API_KEY;
const mapZoom = ref(15);

const props = defineProps({
  eventId: {
    type: String,
    required: true,
  },
});

const mapCenter = ref({ lat: 1.296568, lng: 103.852119 });
const userLocation = ref(null);
const userLocations = ref([]);
const centralPoint = ref(null);

const supabase = useSupabaseClient();

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        await sendLocationToSupabase();
        await retrieveUserLocations();
      },
      (error) => {
        console.error(error);
        alert(`Unable to retrieve your location. ${error.message}`);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

const sendLocationToSupabase = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    const { error } = await supabase.from("locations").upsert(
      {
        user_id: user.id,
        event_id: props.eventId,
        latitude: userLocation.value.lat,
        longitude: userLocation.value.lng,
      },
      { onConflict: "user_id,event_id" }
    );
    if (error) {
      console.error(error);
      alert("Error saving location.");
    }
  } catch (error) {
    console.error(error);
  }
};

const retrieveUserLocations = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    if (!userLocation.value) {
      alert("Please share your location first.");
      return;
    }
    const { data, error } = await supabase
      .from("locations")
      .select("latitude, longitude")
      .eq("event_id", props.eventId);
    if (error) {
      console.error(error);
      return;
    }
    userLocations.value = data.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
    }));
    calculateCentralPoint();
  } catch (error) {
    console.error(error);
  }
};

const calculateCentralPoint = () => {
  if (userLocations.value.length === 0) {
    return;
  }
  let totalLat = 0;
  let totalLng = 0;
  userLocations.value.forEach((location) => {
    totalLat += location.lat;
    totalLng += location.lng;
  });
  centralPoint.value = {
    lat: totalLat / userLocations.value.length,
    lng: totalLng / userLocations.value.length,
  };
  mapCenter.value = centralPoint.value;
};

onMounted(() => {
  // retrieveUserLocations();
});
</script>

<style></style>
