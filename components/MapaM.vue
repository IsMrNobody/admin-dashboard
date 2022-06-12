<template>
  <div>
    <v-row>
      <div id="map" ref="map">
        <p class="top display-1">{{ coordenadas }}</p>
      </div>
      <div class="lineblack"></div>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {
    coordenadas() {
      return this.$store.state.mapa.coordinates
    }
  },
  mounted() {
    this.$store.dispatch('mapa/sendContainer', this.$refs.map)
    if (this.$refs.map) {
      this.$store.dispatch('mapa/initMapaF')
    }
  }
}
</script>

<style>
.top {
  position: absolute;
  margin: 4%;
  bottom: 0;
  z-index: 4;
}
#map {
  width: 100%;
  height: 45vh;
}
.mapboxgl-popup-content h3 {
  color: rgb(0, 0, 0);
}
.mapboxgl-popup-content {
  background: #ff9a15;
}
.punter {
  border-radius: 50%;
  background-size: cover;
  width: 40px;
  height: 40px;
}
.lineblack {
  /* position: absolute; */
  width: 100vw;
  height: 40px;
  margin-top: -38px;
  z-index: 2;
  background-color: black;
}
</style>
