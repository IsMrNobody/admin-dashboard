import _ from 'lodash'
import { postMerchant, MerchantbyCity, getCity, deletMer } from '@/plugins/jartate-api'
import { success } from '@/plugins/swal'

export const state = () => ({
  merchantTable: [],
  cities: [],
  spiner: false,
  coordinates: [-64.4767,9.424],
  categoris: ['criolla', 'rapida', 'sushi', 'hamburguesa', 'pizza', 'china', 'arabe'],
})

export const mutations = {
  setMerchants(state, mer) {
    state.merchantTable = mer
  },
  setcitis(state, c) {
    state.cities = c
  },
  spiner(state, v) {
    state.spiner = v
  },
  deletMerchats(state) {
    state.merchantTable = []
  },
  eleteFromList(state, i) {
    state.merchantTable.splice(i, 1)
  },
  setCoodinates(state, c) {
    state.coordinates = c
  }
}

export const actions = {
  async sendMerchant({ dispatch }, data) {
    try {
      await postMerchant(data)
    } catch (error) {
      console.log(error)
    }
    dispatch('getMerchantbyCity', data.city)
  },
  async getMerchantbyCity({ commit, state, dispatch }, ciudad) {
    commit('deletMerchats')
    commit('spiner', true)
    const merchants = await MerchantbyCity(ciudad)
    commit('setMerchants', merchants)
    const city = _.filter(state.cities, { value: ciudad })
    const coordinates = city[0].coordinates
    dispatch('mapa/fyto', coordinates, { root: true })
    // console.log(coordinates)
    commit('spiner', false)
  },
  async deletMerchant({ commit, state }, i) {
    const dat = state.merchantTable[i]
    await deletMer(dat._id)
    success.fire({ title: 'Eliminado', timer: 1500 })
    commit('eleteFromList', i)
    return console.log(dat)
  },
  async getCities({ state, commit }) {
    const cities = await getCity()
    commit('setcitis', cities)
    return console.log(cities)
  }
}