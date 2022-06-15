import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9zZW1pbGxhbiIsImEiOiJja2FlbHRzaDQwMjFsMndub2kyb3V1cngyIn0.7GdKSjK9jTIcA3is072-Lg'

export const state = () => ({
  map: null,
  coordinates: [-64.4767,9.424]
})

export const mutations = {
  addContain(state, div) {
    state.map = div
  },
  setCoordinates(state, c) {
    state.coordinates = c
  }
}

const marker = []

export const actions = {
  sendContainer({ commit }, div) {
    commit('addContain', div)
  },
  setLocationCoordinates({ commit }, lngLat) {
    // Note I round to 4dp here. 0.0001 is equal to ~ 10 meters.
    // You can use more decimals if you need to though.
    const coordi = [
      Math.round(lngLat.lng * 10000) / 10000,
      Math.round(lngLat.lat * 10000) / 10000,
    ]
    commit('setCoordinates', coordi)
  },

  removeMark() {
    marker.forEach((mark) => {
      mark.remove()
    })
  },

  fyto({ dispatch }, req) {
    dispatch('removeMark')
    this.map.flyTo({ center: req, zoom: 12 })
    const newM = new mapboxgl.Marker({
      draggable: true,
      color: 'red'
    })
      .setLngLat(req)
      .addTo(this.map)
    marker.push(newM)

    newM.on('dragend', () =>{
      const mar = newM.getLngLat()
      dispatch('setLocationCoordinates', mar)
    })
  },

  initMapaF({ state }) {
    this.map = new mapboxgl.Map({
      container: state.map,
      style: 'mapbox://styles/josemillan/ckag0pl3w08e51is6gpvgvlpp',
      center: state.coordinates,
      zoom: 12,
      pitch: 45
    })

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: false
        },
        showAccuracyCircle: false,
        showUserHeading: true,
        trackUserLocation: true
      })
    )
    // this.map.on('load', dispatch('cityMarkr'))
  }
}
