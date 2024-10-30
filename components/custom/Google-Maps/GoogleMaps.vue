<!-- <template>
    <GMapAutocomplete
        placeholder="Search location here"
       :options="{
            bounds: {north: 1.4, south: 1.2, east: 104, west: 102},
            strictBounds: true
       }"
    />
          <GMapMap
      :center="center"
      :zoom="10"
      map-type-id="terrain"
      style="width: 40vw; height: 20rem"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: false
      }"
      ref="gmap"/>


</template>



<style>
    
</style> -->

<template>
    <GoogleMap
      apiKey = process.env.NUXT_MAPS_API_KEY
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
    >
      <Marker :options="{ position: center }" />
    </GoogleMap>
  </template>
  
  <script>
  import { GoogleMap, Marker } from "vue3-google-map";
  
  const apiKey = process.env.NUXT_MAPS_API_KEY;
  
  export default {
    name: "App",
    components: { GoogleMap, Marker },
    data() {
      const center = { lat: 1.296568, lng: 103.852119 };
      return { center, apiKey };
    },
  };
  </script>

<style>

</style>