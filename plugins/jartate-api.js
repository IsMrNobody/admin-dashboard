import axios from 'axios'

// const API_URL = process.env.JARTATE_API_URL
const API_URL = "http://localhost:5000"

export const postMerchant = async (data) => {
    try {
        // console.log(data)
        const res = await axios.post(`${API_URL}/merchants`, data)
        console.log(res)
    } catch (error) {
        console.log('algo paso')
        return error
    }
}