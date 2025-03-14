import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:
        process.env.REACT_PUBLIC_NEST_BASE_URL || 'http://localhost:3000',
})

export default axiosInstance
