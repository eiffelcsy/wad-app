<template>
  <div>
    <div>
      <!-- Conditional rendering of buttons -->
      <div v-if="hasSharedLocation" class="flex flex-row gap-2 mb-4">
        <Button @click="showUserLocation" variant="outline" class="w-full"
          >Show Location</Button
        >
        <Button @click="updateUserLocation" variant="outline" class="w-full"
          >Update Location</Button
        >
      </div>

      <Button v-else @click="shareUserLocation" class="w-full mb-4" variant="outline"
        >Share My Location</Button
      >
    </div>
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
          strokeOpacity: 0.5,
          strokeWeight: 2,
        }"
      />

      <Marker
        v-for="(place, index) in nearbyRestaurants"
        :key="'restaurant-' + index"
        :options="{ position: place.geometry.location, icon: restaurantIcon }"
      >
        <InfoWindow>
          <div class="relative p-2 flex flex-col gap-2" id="header">
            <h1 class="text-2xl text-black">{{ place.name }}</h1>
            <div
              v-if="place.opening_hours?.open_now"
              class="border rounded-md border-indigo-600 w-fit text-black text-xs px-2 py-1 rounded"
            >
              Open Now
            </div>
          </div>
          <div class="p-2 flex flex-col gap-2" id="content">
            <p class="text-sm text-gray-600">{{ place.vicinity }}</p>
            <div class="text-xs text-blue-600 space-x-2">
              <a
                :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  place.geometry.location.lat()
                )},${encodeURIComponent(place.geometry.location.lng())}`"
                target="_blank"
                class="hover:underline"
                >Directions</a
              >
              <span>·</span>
              <a
                :href="`https://www.google.com/maps/place/?q=place_id:${place.place_id}`"
                target="_blank"
                class="hover:underline"
                >More Information</a
              >
            </div>
          </div>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { GoogleMap, Marker, Polyline, InfoWindow } from "vue3-google-map";
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
const nearbyRestaurants = ref([]);
const hasSharedLocation = ref(false);
const restaurantIcon = {
  url: "http://maps.google.com/mapfiles/ms/icons/restaurant.png",
  scaledSize: { width: 32, height: 32 },
};

const supabase = useSupabaseClient();

const checkUserLocation = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("User not authenticated.");
      return;
    }
    const { data, error } = await supabase
      .from("locations")
      .select("latitude, longitude")
      .eq("user_id", user.id)
      .eq("event_id", props.eventId)
      .single();
    if (error && error.code !== "PGRST116") {
      // PGRST116 is "No rows found", which is acceptable here
      console.error(error);
      return;
    }
    if (data) {
      hasSharedLocation.value = true;
      userLocation.value = {
        lat: data.latitude,
        lng: data.longitude,
      };
    } else {
      hasSharedLocation.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to show the user's location without updating it
const showUserLocation = async () => {
  await retrieveUserLocations();
};

// Function to update the user's location
const updateUserLocation = () => {
  getUserLocation(true); // Pass true to indicate an update
};

// Function to share the user's location for the first time
const shareUserLocation = () => {
  getUserLocation(false); // Pass false to indicate initial sharing
};

// Function to get the user's location
const getUserLocation = (isUpdate) => {
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
        alert("Unable to retrieve your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

// Function to send the user's location to Supabase
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
    } else {
      hasSharedLocation.value = true;
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to retrieve all users' locations for the event
const retrieveUserLocations = async () => {
  try {
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

// Function to calculate the central point from all user locations
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
  // After calculating the central point, search for nearby restaurants
  searchNearbyRestaurants();
};

// Function to search for nearby restaurants using Google Places API
const searchNearbyRestaurants = () => {
  // Create a new PlacesService instance
  const service = new google.maps.places.PlacesService(
    document.createElement("div")
  );
  const request = {
    location: centralPoint.value,
    radius: 1000, // 1000 meters
    type: ["restaurant"],
  };
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      nearbyRestaurants.value = results;
    } else {
      console.error("PlacesService failed:", status);
    }
  });
};

onMounted(() => {
  checkUserLocation();
});
</script>

<style></style>
