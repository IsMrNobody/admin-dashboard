import axios from 'axios'

const API_URL = process.env.JARTATE_API_URL || "http://localhost:5000"
// const API_URL = "http://localhost:5000"

export const postMerchant = async (data) => {
    try {
        // console.log(data)
        const res = await axios.post(`${API_URL}/merchants`, data)
        console.log(res)
    } catch (error) {
        console.log(error.response.data)
        return error
    }
}

export const MerchantbyCity = async (city) => {
    try {
        const res = await axios.get(`${API_URL}/merchants/${city}`)
        // console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error.response.data)
        return error
    }
}

export const deletMer = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/merchants/${id}`)
        // console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error.response.data)
        return error
    }
}

export const getCity = async () => {
    try {
        const res = await axios.get(`${API_URL}/cities`)
        return res.data
    } catch (error) {
        console.log(error.response.data)
        return error
    }
}