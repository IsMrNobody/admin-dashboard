import { postMerchant } from '@/plugins/jartate-api'

export const state = () => ({
  
})

export const mutation = {

}

export const actions = {
  async sendMerchant({ commit }, data) {
    const merchantSend = await postMerchant(data)
    console.log('enviando por estore >' + merchantSend)
  }
}